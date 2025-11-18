import { lazy, Suspense, useEffect, useState, useMemo, useCallback } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoadingSpinner from "./components/shared/spinner/loading-spinner";
import { RootLoadingProvider } from "./components/shared/spinner/root-loading-provider";
import ErrorBoundary from "./components/shared/error-boundary";
import { memo } from "react";
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Función mejorada para carga perezosa con precarga inteligente
const lazyLoad = (factory: () => Promise<any>, preload = false) => {
  const LazyComponent = lazy(() => {
    return factory().catch(error => {
      console.error("Error cargando componente:", error);
      return Promise.reject(error);
    });
  });

  if (preload) {
    // Precargar el componente en segundo plano
    factory().catch(() => {});
  }

  return LazyComponent;
};

// Componentes de autenticación con carga optimizada
const FlippableAuthForm = lazyLoad(() => import("./components/form/login-register"), true);
const ResetPasswordForm = lazyLoad(() => import("./components/form/reset-password-form"));
const RegisterForm = lazyLoad(() => import("./components/form/register-form"), true);

// Componente principal con carga diferida
const Home = lazyLoad(() => import("./components/form/main-layout"), true);

// Memoizar el componente de fallback para evitar re-renders
const LoadingFallback = memo(() => <LoadingSpinner />);


export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [preloadedComponents, setPreloadedComponents] = useState<Set<string>>(new Set());

  // Memoizar la función de precarga
  const preloadComponent = useCallback((path: string) => {
    if (preloadedComponents.has(path)) return;

    const componentMap: Record<string, () => Promise<any>> = {
      '/home': () => import("./components/form/main-layout"),
      '/auth/login': () => import("./components/form/login-register"),
      '/auth/register': () => import("./components/form/register-form"),
    };

    const preload = componentMap[path];
    if (preload) {
      preload().then(() => {
        setPreloadedComponents(prev => new Set(prev).add(path));
      });
    }
  }, [preloadedComponents]);

  useEffect(() => {
    setAppReady(true);
    
    // Función mejorada para cargar recursos cuando el navegador esté inactivo
    const loadResourcesWhenIdle = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          const path = window.location.pathname;
          
          // Precargar componentes basados en la ruta actual
          if (path.includes('/auth')) {
            preloadComponent('/home');
          } else if (path === '/') {
            preloadComponent('/auth/login');
          }
        }, { timeout: 2000 });
      }
    };

    if (appReady && document.readyState === 'complete') {
      loadResourcesWhenIdle();
    } else {
      window.addEventListener('load', loadResourcesWhenIdle, { once: true });
    }

    return () => {
      window.removeEventListener('load', loadResourcesWhenIdle);
    };
  }, [appReady, preloadComponent]);

  // Memoizar las rutas para evitar re-renders innecesarios
  const routes = useMemo(() => (
    <Routes>
      <Route path="/auth" element={<FlippableAuthForm />}>
        <Route path="login" element={<FlippableAuthForm initialSide="login" />} />
        <Route path="register" element={<FlippableAuthForm initialSide="register" />} />
        <Route path="reset" element={<FlippableAuthForm initialSide="reset" />} />
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="register/:companyId" element={<FlippableAuthForm initialSide="register" />} />
      </Route>
      <Route 
        path="/auth/reset-password" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordForm />
          </Suspense>
        } 
      />
      <Route 
        path="/home" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        } 
      />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  ), []);

  return (
    <ErrorBoundary>
      <RootLoadingProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            {routes}
          </Suspense>
        </Router>
      </RootLoadingProvider>
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import LoadingSpinner from "./loading-spinner"

const LoadingContext = createContext({
  setIsLoading: (_loading: boolean) => {},
  isLoading: false,
  setError: (_error: Error | null) => {},
  error: null as Error | null,
})

export const useLoading = () => useContext(LoadingContext)

export function RootLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [timeoutExpired, setTimeoutExpired] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const minLoadingTime = setTimeout(() => {
      setTimeoutExpired(true)
    }, 200)

    const maxLoadingTime = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // Verificar recursivamente si la carga se ha completado
    const checkIfContentLoaded = () => {
      if (!isLoading || error) return;

      // Verificar si los recursos críticos están cargados
      const criticalResources = Array.from(document.querySelectorAll('img, script'))
        .filter(el => {
          if (el instanceof HTMLImageElement) {
            return !el.complete;
          }
          return false;
        });

      if (criticalResources.length === 0 && timeoutExpired) {
        setIsLoading(false);
      } else {
        // Verificar nuevamente en breve
        setTimeout(checkIfContentLoaded, 100);
      }
    };

    checkIfContentLoaded();

    // Agregar un manejador de errores global
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Error global capturado:", event.error);
      setError(event.error);
      setIsLoading(false);
    };

    // Agregar un manejador para promesas no controladas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Promesa rechazada no controlada:", event.reason);
      setError(new Error("Se produjo un error inesperado en una operación asíncrona"));
      setIsLoading(false);
    };

    // Registrar los manejadores de eventos
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      clearTimeout(minLoadingTime);
      clearTimeout(maxLoadingTime);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    }
  }, [isLoading, timeoutExpired, error])

  // Si hay un error, mostramos el contenido principal para que el ErrorBoundary pueda manejarlo
  if (error) {
    return (
      <LoadingContext.Provider value={{ setIsLoading, isLoading, setError, error }}>
        {children}
      </LoadingContext.Provider>
    );
  }

  if (!isMounted) {
    return <LoadingSpinner />
  }

  return (
    <LoadingContext.Provider value={{ setIsLoading, isLoading, setError, error }}>
      {isLoading ? <LoadingSpinner /> : children}
    </LoadingContext.Provider>
  )
}


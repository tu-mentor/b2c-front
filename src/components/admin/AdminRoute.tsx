import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserId, getUserInfo, isAuthenticated } from "../../services/auth-service";
import { UserRole } from "../../types/admin-types";
import LoadingSpinner from "../shared/spinner/loading-spinner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Primero verificar si está autenticado
        const token = isAuthenticated();
        if (!token) {
          console.log("AdminRoute: No hay token de autenticación");
          setRedirectTo("/auth/login");
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Obtener el ID del usuario
        const userId = getUserId();
        if (!userId) {
          console.log("AdminRoute: No hay user_id en localStorage");
          setRedirectTo("/auth/login");
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Obtener información del usuario
        const userInfo = await getUserInfo(userId);
        if (!userInfo || !userInfo.user) {
          console.log("AdminRoute: No se pudo obtener información del usuario");
          setRedirectTo("/auth/login");
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Verificar el rol
        const userRole = userInfo.user.role as UserRole;
        console.log("AdminRoute: Rol del usuario:", userRole);
        console.log("AdminRoute: UserRole.ADMIN:", UserRole.ADMIN);
        console.log("AdminRoute: UserRole.EDITOR:", UserRole.EDITOR);
        console.log("AdminRoute: userInfo completo:", userInfo);
        
        // Comparar con strings también por si acaso el enum no coincide
        const roleString = String(userRole || '').toLowerCase();
        const isAdminOrEditor = 
          userRole === UserRole.ADMIN || 
          userRole === UserRole.EDITOR ||
          roleString === 'admin' ||
          roleString === 'editor';

        if (!isAdminOrEditor) {
          console.log("AdminRoute: Usuario no tiene permisos de administrador. Rol recibido:", userRole);
          setRedirectTo("/home");
        } else {
          console.log("AdminRoute: Usuario autorizado con rol:", userRole);
        }

        setIsAuthorized(isAdminOrEditor);
      } catch (error) {
        console.error("AdminRoute: Error checking authorization:", error);
        setRedirectTo("/auth/login");
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthorized && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../shared/button";
import { LayoutDashboard, Users, LogOut, Menu, X, CreditCard, ShoppingCart, Building2, Package, Shield, UserCog, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, getUserId, getUserInfo } from "../../services/auth-service";
import AdminDashboard from "./AdminDashboard";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import PurchaseRequestsManagement from "./PurchaseRequestsManagement";
import CompanyManagement from "./CompanyManagement";
import ModuleManagement from "./ModuleManagement";
import CustomRolesManagement from "./CustomRolesManagement";
import B2CDefaultsManagement from "./B2CDefaultsManagement";
import EmailTemplatesManagement from "./EmailTemplatesManagement";

type AdminSection = "dashboard" | "users" | "subscriptions" | "purchase-requests" | "companies" | "modules" | "custom-roles" | "b2c-defaults" | "email-templates";

export default function AdminLayout() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();

  // Cerrar sidebar en móviles cuando se cambia de sección
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Establecer estado inicial
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar sidebar en móviles al cambiar de sección
  const handleSectionChange = (section: AdminSection) => {
    setActiveSection(section);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userId = getUserId();
        if (userId) {
          const userInfo = await getUserInfo(userId);
          if (userInfo?.user) {
            setUserName(`${userInfo.user.firstName} ${userInfo.user.lastName}`);
            setUserEmail(userInfo.user.email || "");
          }
        }
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };
    loadUserInfo();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const menuItems = [
    {
      id: "dashboard" as AdminSection,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "users" as AdminSection,
      label: "Usuarios",
      icon: Users,
    },
    {
      id: "subscriptions" as AdminSection,
      label: "Suscripciones",
      icon: CreditCard,
    },
    {
      id: "purchase-requests" as AdminSection,
      label: "Solicitudes de Compra",
      icon: ShoppingCart,
    },
    {
      id: "companies" as AdminSection,
      label: "Empresas",
      icon: Building2,
    },
    {
      id: "modules" as AdminSection,
      label: "Módulos",
      icon: Package,
    },
    {
      id: "custom-roles" as AdminSection,
      label: "Roles Personalizados",
      icon: Shield,
    },
    {
      id: "b2c-defaults" as AdminSection,
      label: "Configuración B2C",
      icon: UserCog,
    },
    {
      id: "email-templates" as AdminSection,
      label: "Plantillas de Correo",
      icon: Mail,
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 relative">
        {/* Overlay para móviles */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -256 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed md:relative z-50 h-full bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-800 shadow-2xl overflow-hidden w-64`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Admin Panel</h2>
                  <p className="text-xs text-indigo-200">Panel de Control</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden text-white hover:bg-indigo-500/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                        : "text-indigo-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : ""}`} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-indigo-500/30">
              <Button
                variant="outline"
                className="w-full flex items-center gap-3 justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 md:px-6 py-3 md:py-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0" />
              <div className="flex items-center gap-2 md:gap-3">
                {userName && (
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">{userName}</p>
                    {userEmail && (
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{userEmail}</p>
                    )}
                  </div>
                )}
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0">
                  {userName ? userName.charAt(0).toUpperCase() : "A"}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            {activeSection === "dashboard" && <AdminDashboard />}
            {activeSection === "users" && <UserManagement />}
            {activeSection === "subscriptions" && <SubscriptionManagement />}
            {activeSection === "purchase-requests" && <PurchaseRequestsManagement />}
            {activeSection === "companies" && <CompanyManagement />}
            {activeSection === "modules" && <ModuleManagement />}
            {activeSection === "custom-roles" && <CustomRolesManagement />}
            {activeSection === "b2c-defaults" && <B2CDefaultsManagement />}
            {activeSection === "email-templates" && <EmailTemplatesManagement />}
          </main>
        </div>
    </div>
  );
}


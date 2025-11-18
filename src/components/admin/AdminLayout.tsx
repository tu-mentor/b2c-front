import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../shared/button";
import { LayoutDashboard, Users, LogOut, Menu, X, CreditCard, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth-service";
import AdminDashboard from "./AdminDashboard";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import PurchaseRequestsManagement from "./PurchaseRequestsManagement";

type AdminSection = "dashboard" | "users" | "subscriptions" | "purchase-requests";

export default function AdminLayout() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

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
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        {/* Sidebar */}
        <motion.aside
          initial={{ width: sidebarOpen ? 256 : 0 }}
          animate={{ width: sidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-800 shadow-2xl overflow-hidden ${
            sidebarOpen ? "w-64" : "w-0"
          }`}
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
                    onClick={() => setActiveSection(item.id)}
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
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  A
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
          </main>
        </div>
    </div>
  );
}


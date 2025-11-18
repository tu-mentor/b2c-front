import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../shared/button";
import { LayoutDashboard, Users, LogOut, Menu, X, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth-service";
import AdminDashboard from "./AdminDashboard";
import UserManagement from "./UserManagement";
import SubscriptionManagement from "./SubscriptionManagement";

type AdminSection = "dashboard" | "users" | "subscriptions";

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
  ];

  return (
    <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <motion.aside
          initial={{ width: sidebarOpen ? 256 : 0 }}
          animate={{ width: sidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-white border-r border-gray-200 overflow-hidden ${
            sidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full flex items-center gap-3 justify-start"
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
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex-1" />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            {activeSection === "dashboard" && <AdminDashboard />}
            {activeSection === "users" && <UserManagement />}
            {activeSection === "subscriptions" && <SubscriptionManagement />}
          </main>
        </div>
    </div>
  );
}


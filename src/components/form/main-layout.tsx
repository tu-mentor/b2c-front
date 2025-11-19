import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import {
  BarChart2,
  BookCheck,
  Briefcase,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDollarSign,
  Home,
  HomeIcon,
  LogOut,
  Menu,
  Moon,
  Rocket,
  Sun,
  User,
  UserCheck2,
  UserCircle,
  UserPlus,
  X,
  GraduationCap,
  Lightbulb,
  Target,
  BookOpen,
  LineChart,
  FileText,
  Shield,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../types/admin-types";
import LogoSvg from "../../assets/logo.svg";
import { getUserId, getUserInfo, isAuthenticated, logout } from "../../services/auth-service";
import { suscriptionService } from "../../services/suscription-service";
import { userService } from "../../services/user-service";
import { vocationalService } from "../../services/vocational-service";
import type { UserModel } from "../../types/auth-types";
import type { ChildSubscription, UserSubscription } from "../../types/suscriptions";
import { Button } from "../shared/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shared/dropdown-menu";
import { cn } from "../utils/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../shared/tooltip";
import { ScrollArea } from "../shared/scroll-area";
import { PageContainer } from "../shared/page-container";

// Lazy loading de componentes
const UserProfile = lazy(() => import("./user-profile"));
const ChasideVocationalTest = lazy(() => import("./vocational-test/chaside/chaside"));
const HollandVocationalTest = lazy(() => import("./vocational-test/holland/holland"));
const Results = lazy(() => import("./vocational-test/result/results"));
const InstructionsVocationalTest = lazy(() => import("./vocational-test/instructions"));
const WelcomeSection = lazy(() => import("./welcome"));
const ModuleStore = lazy(() => 
  import("./module-store/module-store").catch((error) => {
    console.error("Error loading ModuleStore:", error);
    // Retornar un componente de fallback
    return {
      default: () => (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error al cargar la tienda de módulos</p>
            <p className="text-sm text-gray-500">Por favor, recarga la página</p>
          </div>
        </div>
      )
    };
  })
);

type SubMenuItem = {
  icon: LucideIcon;
  text: string;
  id: string;
  enabled: boolean;
};

type MenuItem = {
  icon: LucideIcon;
  text: string;
  id: string;
  identifier: string;
  enabled: boolean;
  subItems?: SubMenuItem[];
};

const initialMenuItems: MenuItem[] = [
  { icon: Home, text: "Inicio", id: "home", identifier: "0", enabled: true },
  {
    icon: GraduationCap,
    text: "Orientación vocacional",
    id: "vocationalGuidance",
    identifier: "678d625ce2695682ef90951b",
    enabled: true,
    subItems: [
      { icon: FileText, text: "Instrucciones", id: "instructions", enabled: true },
      { icon: Target, text: "Prueba Holland", id: "holland", enabled: true },
      { icon: Lightbulb, text: "Prueba CHASIDE", id: "chaside", enabled: true },
      { icon: LineChart, text: "Resultados", id: "results", enabled: true },
    ],
  },
  {
    icon: CircleDollarSign,
    text: "Educación financiera",
    id: "finance",
    identifier: "678d68398e67de00d38132eb",
    enabled: true,
  },
  {
    icon: UserCheck2,
    text: "Marca personal",
    id: "personal",
    identifier: "678d68398e67de00d38132ec",
    enabled: false,
  },
  {
    icon: Rocket,
    text: "Emprendimiento",
    id: "emp",
    identifier: "678d68398e67de00d38132ed",
    enabled: false,
  },
  {
    icon: Briefcase,
    text: "Primer empleo",
    id: "job",
    identifier: "678d68398e67de00d38132ee",
    enabled: false,
  },
];

async function getCareers(userId: string): Promise<string[]> {
  const response = await vocationalService.getCareers(userId);
  return response;
}

// Estilos y animaciones inspirados en macOS
const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  hover: { 
    scale: 1.02,
    x: 5,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98 },
};

const subMenuItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  hover: { 
    scale: 1.01,
    x: 3,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.99 },
};

export default function MainLayout() {
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<UserModel | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [recommendedCareers, setRecommendedCareers] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isB2BUser, setIsB2BUser] = useState(false);


  const handleLogout = useCallback(() => {
    logout();
    navigate("/auth/login");
  }, [navigate]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const toggleDarkMode = useCallback(() => setIsDarkMode((prev) => !prev), []);

  // Combinación de efectos relacionados
  useEffect(() => {
    const initializeApp = async () => {
      if (!isAuthenticated()) {
        navigate("/auth/login");
        return;
      }

      try {
        const userId = getUserId();
        if (!userId) return;

        const userInfo = await getUserInfo(userId);
        if (userInfo) {
          setUser(userInfo.user);

          const subscriptions = await suscriptionService.getUserSuscription(userId);
          setUserSubscription(subscriptions);

          if (subscriptions) {
            // Verificar si es usuario B2B (tiene company pero no suscripciones individuales)
            const hasIndividualSubscriptions = subscriptions.subscriptions && subscriptions.subscriptions.length > 0;
            const hasCompany = userInfo.user?.companyId || userInfo.user?.company;
            const b2bStatus = !!hasCompany && !hasIndividualSubscriptions;
            setIsB2BUser(b2bStatus);
            updateMenuItems(subscriptions, b2bStatus);
          }
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        navigate("/auth/login");
      }
    };

    initializeApp();
  }, [navigate]);

  // Escuchar eventos personalizados para cambiar de sección
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent<string>) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('changeSection' as any, handleSectionChange as EventListener);
    
    return () => {
      window.removeEventListener('changeSection' as any, handleSectionChange as EventListener);
    };
  }, []);

  // Memoización de la función updateMenuItems
  const updateMenuItems = useCallback((subscriptions: UserSubscription, isB2B: boolean = false) => {
    const currentDate = new Date();

    const updatedMenuItems = initialMenuItems.map((item) => {
      const isEnabled =
        item.identifier === "0" ||
        (subscriptions?.subscriptions.some(
          (sub) =>
            sub.moduleId === item.identifier &&
            sub.subscriptionStatus === "1" &&
            new Date(sub.subscriptionEndDate) > currentDate
        ) ??
          false);

      const updatedSubItems = item.subItems?.map((subItem) => ({
        ...subItem,
        enabled: isEnabled,
      }));

      return {
        ...item,
        enabled: isEnabled,
        subItems: updatedSubItems,
      };
    });

    // Agregar opción de Tienda de Módulos si es usuario B2B
    if (isB2B) {
      const storeMenuItem: MenuItem = {
        icon: ShoppingCart,
        text: "Tienda de Módulos",
        id: "moduleStore",
        identifier: "store",
        enabled: true,
      };
      updatedMenuItems.push(storeMenuItem);
    }

    setMenuItems(updatedMenuItems);
    return updatedMenuItems;
  }, []);

  // Optimización de event listeners con debounce
  useEffect(() => {
    const handleResize = debounce(() => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
        setIsSmallScreen(false);
      } else {
        setIsSidebarOpen(false);
        setIsSmallScreen(true);
      }
    }, 250);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Verificar si el usuario es admin o editor
  const isAdminOrEditor = useMemo(() => {
    if (!user?.role) return false;
    const userRole = user.role as UserRole;
    const roleString = String(userRole || '').toLowerCase();
    
    // Comparar con enum y también con strings para mayor compatibilidad
    const isAdmin = 
      userRole === UserRole.ADMIN || 
      roleString === 'admin';
    const isEditor = 
      userRole === UserRole.EDITOR || 
      roleString === 'editor';
    
    console.log("MainLayout: Verificando rol del usuario:", {
      userRole,
      roleString,
      UserRoleADMIN: UserRole.ADMIN,
      UserRoleEDITOR: UserRole.EDITOR,
      isAdmin,
      isEditor,
      result: isAdmin || isEditor
    });
    
    return isAdmin || isEditor;
  }, [user?.role]);

  // Memoización del menú de usuario
  const UserMenu = useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 dark:text-gray-400"
            aria-label="Menú de perfil de usuario"
          >
            <UserCircle className="h-5 w-5" />
            <span className="inline text-sm">Perfil</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleMenuClick("profile")} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mi cuenta</span>
          </DropdownMenuItem>
          {isAdminOrEditor && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/admin")}
                className="cursor-pointer"
              >
                <Shield className="mr-2 h-4 w-4" />
                <span>Panel de Administración</span>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [handleLogout, isAdminOrEditor, navigate]
  );

  // Memoización del contenido principal
  const MainContent = useMemo(() => {
    switch (activeSection) {
      case "home":
        return (
          <Suspense fallback={<div>Cargando...</div>}>
            <WelcomeSection
              subscription={userSubscription}
              userData={{
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
              }}
            />
          </Suspense>
        );
      case "instructions":
        return (
          <Suspense fallback={<div>Cargando...</div>}>
            <InstructionsVocationalTest totalChildren={1} />
          </Suspense>
        );
      case "holland":
        return (
          <Suspense fallback={<div>Cargando...</div>}>
            <HollandVocationalTest key={`holland-${Date.now()}`} />
          </Suspense>
        );
      case "chaside":
        return (
          <Suspense fallback={<div>Cargando...</div>}>
            <ChasideVocationalTest key={`chaside-${Date.now()}`} />
          </Suspense>
        );
      case "results":
        return (
          <Suspense fallback={<div>Cargando...</div>}>
            <Results
              key={`results-${Date.now()}`}
              userId={user?.id || ""}
              subscriptions={userSubscription?.subscriptions || []}
            />
          </Suspense>
        );
      case "profile":
        return user ? (
          <Suspense fallback={<div>Cargando...</div>}>
            <UserProfile
              userData={{
                ...user,
              }}
            />
          </Suspense>
        ) : null;
      case "moduleStore":
        return (
          <Suspense fallback={<div>Cargando...</div>}>
            <ModuleStore />
          </Suspense>
        );
      default:
        return (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-semibold">En desarrollo</div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                Esta sección está actualmente en desarrollo.
              </div>
            </div>
          </div>
        );
    }
  }, [activeSection, user, userSubscription]);

  const getFirstEnabledMenuItem = (items: MenuItem[]): string => {
    for (const item of items) {
      if (item.enabled) {
        return item.id;
      }
    }
    return "home"; // Default to home if no enabled items found
  };

  useEffect(() => {
    setOpenSubmenu("vocationalGuidance");
  }, []);

  useEffect(() => {
    if (activeSection === "holland" || activeSection === "chaside") {
      setOpenSubmenu("vocationalGuidance");
    }
  }, [activeSection]);

  const handleMenuClick = useCallback((id: string) => {
    if (id === "vocationalGuidance") {
      setOpenSubmenu("vocationalGuidance");
    } else {
      setActiveSection(id);
      if (id !== "holland" && id !== "chaside") {
        setOpenSubmenu(null);
      }
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
  }, []);

  const handleSubmenuClick = useCallback((id: string) => {
    setActiveSection(id);
    setOpenSubmenu("vocationalGuidance");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);



  // Ya no es necesario mostrar modal de selección de hijo, ahora solo hay un usuario

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        //setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              ref={sidebarRef}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed md:relative z-50 h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col shadow-lg"
            >
              <div className="relative p-6 flex flex-col items-center space-y-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-blue-50/80 via-white/80 to-indigo-50/80 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-full p-3 border-2 border-blue-200/50 dark:border-gray-600 shadow-lg">
                      <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white dark:border-gray-800 shadow-lg"
                      animate={{
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(34, 197, 94, 0.4)",
                          "0 0 0 8px rgba(34, 197, 94, 0)",
                          "0 0 0 0 rgba(34, 197, 94, 0.4)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                  </div>
                </motion.div>

                <div className="relative z-10 text-center space-y-2">
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
                  >
                    {user?.firstName} {user?.lastName}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center justify-center space-x-1"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>{user?.email}</span>
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Activo</span>
                    <span>•</span>
                    <span>Premium</span>
                  </motion.div>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <nav className="space-y-2 p-4">
                  {menuItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      transition={{ duration: 0.2 }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={activeSection === item.id ? "default" : "ghost"}
                              className={cn(
                                "w-full justify-between text-left group relative overflow-hidden",
                                "transition-all duration-300 ease-out",
                                "hover:bg-blue-50/80 dark:hover:bg-gray-700/50",
                                "rounded-xl border border-transparent hover:border-blue-200/50",
                                activeSection === item.id
                                  ? "bg-blue-500/90 text-white hover:bg-blue-600/90 shadow-sm"
                                  : item.enabled
                                  ? "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                  : "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                              )}
                              onClick={() => handleMenuClick(item.id)}
                              disabled={!item.enabled}
                            >
                              <span className="flex items-center">
                                <motion.div
                                  className={cn(
                                    "mr-3 p-1 rounded-lg transition-all duration-300 ease-out",
                                    activeSection === item.id
                                      ? "text-white bg-white/20"
                                      : "text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:rotate-180 group-hover:scale-110"
                                  )}
                                >
                                  <item.icon className="h-5 w-5" />
                                </motion.div>
                                <span className="font-semibold text-sm">{item.text}</span>
                              </span>
                              {item.subItems && (
                                <motion.div
                                  animate={{
                                    rotate: openSubmenu === item.id ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className={cn(
                                    activeSection === item.id
                                      ? "text-white"
                                      : "text-primary/70 dark:text-primary/70"
                                  )}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </motion.div>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-primary/10">
                            <p className="text-sm font-medium text-primary">{item.text}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <AnimatePresence>
                        {item.subItems && openSubmenu === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-6 mt-1 space-y-1 overflow-hidden"
                          >
                            {item.subItems.map((subItem) => (
                              <motion.div
                                key={subItem.id}
                                variants={subMenuItemVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                whileTap="tap"
                                transition={{ duration: 0.2 }}
                              >
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant={activeSection === subItem.id ? "default" : "ghost"}
                                        className={cn(
                                          "w-full justify-start text-left group relative",
                                          "transition-all duration-300 ease-out",
                                          "hover:bg-gray-100/80 dark:hover:bg-gray-700/30",
                                          "rounded-lg border border-transparent hover:border-gray-200/50",
                                          activeSection === subItem.id
                                            ? "bg-gray-600/90 text-white hover:bg-gray-700/90 shadow-sm"
                                            : subItem.enabled
                                            ? "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                            : "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                                        )}
                                        onClick={() => handleSubmenuClick(subItem.id)}
                                        disabled={!subItem.enabled}
                                      >
                                        <motion.div
                                          className={cn(
                                            "mr-2 p-1 rounded-md transition-all duration-300 ease-out",
                                            activeSection === subItem.id
                                              ? "text-white bg-white/20"
                                              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:rotate-180 group-hover:scale-105"
                                          )}
                                        >
                                          <subItem.icon className="h-4 w-4" />
                                        </motion.div>
                                        <span className="font-medium text-sm">{subItem.text}</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-primary/10">
                                      <p className="text-sm font-medium text-primary">{subItem.text}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </nav>
              </ScrollArea>

              <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-800/30">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left hover:bg-red-50/80 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 border-gray-200 hover:border-red-300 rounded-xl"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.div
          className="flex-1 flex flex-col overflow-hidden"
          animate={{ marginLeft: isSidebarOpen ? 0 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-4 flex justify-between items-center shadow-md"
          >
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="text-primary dark:text-primary"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-primary dark:text-white hidden md:block"
              >
                <img src={LogoSvg || "/placeholder.svg"} alt="Logo" className="w-56" />
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-primary dark:text-primary hidden"
              >
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
              {!isSmallScreen && UserMenu}
            </div>
          </motion.nav>



          <main className="flex-1 overflow-x-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto p-3"
              >
                {MainContent}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="bg-gradient-to-r from-blue-50/90 via-white/90 to-indigo-50/90 dark:from-gray-800/90 dark:via-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm border-t border-blue-200/50 dark:border-gray-700/50 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                >
                  <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Tu-Mentor.com
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Orientación inteligente
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Powered by AI</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Eureka-ia</span>
                </motion.div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © 2024 Tu-Mentor.com by Eureka-ia
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Todos los derechos reservados
                </p>
              </div>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}

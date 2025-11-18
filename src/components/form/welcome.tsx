import { TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { ArrowUp, Rotate3DIcon, Star, Home, Calendar, BookOpen, Users, Target, Lightbulb, CircleDollarSign, UserCheck2, Rocket, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { funFacts, modules } from "../../constants/constants";
import { Button } from "../shared/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../shared/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../shared/table";
import { Tooltip } from "../shared/tooltip";
import { Badge } from "../shared/badge";

interface ChildSubscription {
  childId: string;
  subscriptions: {
    subscriptionStatus: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    subscriptionType: string;
    remainingDays: number;
    moduleId: string;
  }[];
}

interface UserData {
  firstName: string;
  lastName: string;
  children: { id: string; childName: string }[];
}

interface WelcomeSectionProps {
  subscription: ChildSubscription[] | null;
  userData: UserData;
  selectedChildId: string;
}

export default function WelcomeSection({
  subscription,
  userData,
  selectedChildId,
}: WelcomeSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [dailyFact, setDailyFact] = useState("");
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Mostrar información inmediatamente
    setProgress(100);
    setIsSubscriptionLoading(false);
    setIsUserDataLoading(false);

    return () => {};
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Set a random fun fact for the day
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setDailyFact(funFacts[randomIndex]);
  }, []);

  if (!mounted) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatter.format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-6 pb-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                <Home className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Bienvenido, {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                  Aquí tienes un resumen de tus datos y módulos de aprendizaje
                </p>
              </div>
            </div>
          </motion.div>

          {/* Alert Card for Multiple Children */}
          {userData.children.length > 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                <CardContent className="p-6 flex items-start space-x-4 relative z-10">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <Star className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-3 text-blue-800 dark:text-blue-200">
                      ⚠️ Antes de iniciar: Selecciona el nombre del hijo
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        En la parte superior derecha de la plataforma encuentras la opción para
                        seleccionar el nombre
                      </span>{" "}
                      de quien va a realizar las pruebas. Esto es indispensable ya que los resultados
                      de las pruebas se asignan específicamente para cada hijo.
                    </p>
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 text-blue-500 animate-bounce">
                  <ArrowUp className="w-8 h-8" />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subscriptions Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                  <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                    <Users className="w-5 h-5" />
                    <span>Suscripciones Activas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {isSubscriptionLoading ? (
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 py-3">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800">
                          <TableRow>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Nombre</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Estado</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Fecha Fin</TableHead>
                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Módulos</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userData.children.map((child) => {
                            const childSubscription = subscription?.find(
                              (sub) => sub.childId === child.id
                            );
                            const subscriptionInfo = childSubscription?.subscriptions[0];
                            const moduleNames = subscriptionInfo
                              ? modules
                                  .filter((module) => module.identifier === subscriptionInfo.moduleId)
                                  .map((module) => module.title)
                                  .join(", ")
                              : "N/A";
                            const isActive = subscriptionInfo?.subscriptionStatus == "1" &&
                              new Date(subscriptionInfo.subscriptionEndDate) > new Date();

                            return (
                              <TableRow key={child.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <TableCell className="font-medium text-gray-800 dark:text-gray-200">{child.childName}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={isActive ? "default" : "destructive"}
                                    className={isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                                  >
                                    {isActive ? "Activo" : "Inactivo"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {subscriptionInfo
                                      ? formatDate(subscriptionInfo.subscriptionEndDate)
                                      : "N/A"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {moduleNames}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Information Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200/50 dark:border-gray-700/50">
                  <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                    <Calendar className="w-5 h-5" />
                    <span>Información del Día</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isUserDataLoading ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Fecha y hora actual
                        </h4>
                        <p className="text-lg md:text-xl font-bold text-blue-800 dark:text-blue-200">
                          {currentDateTime.toLocaleString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                        <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Dato curioso del día
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">{dailyFact}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Modules Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Módulos de Aprendizaje
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Explora los diferentes módulos disponibles para tu desarrollo
              </p>
            </div>

            {isSubscriptionLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                      </div>
                      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => {
                  const isEnabled = subscription
                    ? subscription.some(
                        (childSub) =>
                          childSub.childId === selectedChildId &&
                          childSub.subscriptions.some(
                            (sub) =>
                              sub.moduleId === module.identifier.toString() &&
                              sub.subscriptionStatus === "1"
                          )
                      )
                    : false;
                  const subscriptionModule = subscription
                    ? subscription
                        .flatMap((childSub) => childSub.subscriptions)
                        .find((sub) => sub.moduleId === module.identifier.toString())
                    : undefined;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        className={`overflow-hidden transition-all duration-300 border-2 ${
                          isEnabled 
                            ? "hover:shadow-2xl hover:scale-105 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20" 
                            : "opacity-70 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                        }`}
                      >
                        <CardHeader className={`pb-3 ${isEnabled ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : 'bg-gray-100/50 dark:bg-gray-800/50'}`}>
                          <CardTitle className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${isEnabled ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                              <module.icon className="w-5 h-5" />
                            </div>
                            <span className={isEnabled ? "text-blue-800 dark:text-blue-200" : "text-gray-600 dark:text-gray-400"}>{module.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className={`text-sm ${isEnabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>{module.description}</p>
                        </CardContent>
                        <CardFooter className={`p-4 ${isEnabled ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : 'bg-gray-100/50 dark:bg-gray-800/50'}`}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={isEnabled ? "default" : "outline"}
                                  className={`w-full justify-between ${isEnabled ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                  <span>{isEnabled ? "Habilitado" : "No disponible"}</span>
                                  <Rotate3DIcon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-white border-0">
                                {isEnabled
                                  ? `Tienes acceso hasta ${new Date(
                                      subscriptionModule!.subscriptionEndDate
                                    ).toLocaleDateString()}`
                                  : "Actualiza tu suscripción para acceder"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

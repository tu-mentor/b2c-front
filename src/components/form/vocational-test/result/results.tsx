"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle,
  FileText,
  GraduationCap,
  Info,
  Sparkles,
  Stars,
  User,
  XCircle,
  LineChart,
} from "lucide-react";
import type React from "react";
import { useEffect, useState, useRef, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { getUserId, getUserInfo } from "../../../../services/auth-service";
import { vocationalService } from "../../../../services/vocational-service";
import { resultService } from "../../../../services/vocational-test/result-service";
import type { CompanyCharacteristic } from "../../../../types/auth-types";
import type { Subscription } from "../../../../types/suscriptions";
import { Alert, AlertDescription, AlertTitle } from "../../../shared/alert";
import { Avatar, AvatarFallback } from "../../../shared/avatar";
import { Badge } from "../../../shared/badge";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/dialog";
import { Input } from "../../../shared/input";
import { LoadingCard } from "../../../shared/loading/loading-card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../shared/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../shared/tooltip";
import ProjectKit from "../../project-kit/project-kit";
import CareerComparison from "../career-costs/career-comparison";
import { mapCareersToFields } from "../career-field-mapping";
import { questions as chasideQuestions } from "../chaside/chaside-data";
import { questions as hollandQuestions } from "../holland/holland-data";
import SalaryDataVisualization from "../salary-employment-dashboard/SalaryDataVisualization";
import type {
  ChasideScores,
  UserResult,
  UserRowProps,
  HollandScores,
} from "../types/results-types";
import TextFormatter from "./format-text";
import AIThinkingOverlay from "./AIThinkingOverlay";
import { PageContainer } from "../../../shared/page-container";
import { Career } from "../career-costs/types_career";

const HOLLAND_QUESTIONS = hollandQuestions.length;
const CHASIDE_QUESTIONS = chasideQuestions.length;

const UserRow = memo(
  ({ userId, hollandResult, chasideResult, aiResultsAvailable, setAiResultsAvailable, handleViewCareerComparison }: {
    userId: string;
    hollandResult: any;
    chasideResult: any;
    aiResultsAvailable: boolean;
    setAiResultsAvailable: (value: boolean) => void;
    handleViewCareerComparison: (careers: Career[]) => void;
  }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isEmploymentDialogOpen, setIsEmploymentDialogOpen] = useState<boolean>(false);
    const [isCarrerCostsDialogOpen, setIsCarrerCostsDialogOpen] = useState<boolean>(false);
    const [isCareerComparisonDialogOpen, setIsCareerComparisonDialogOpen] = useState<boolean>(false);
    const [aiResponse, setAiResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayedResponse, setDisplayedResponse] = useState<string>("");
    const [allTestsCompleted, setAllTestsCompleted] = useState(false);
    const [existingResults, setExistingResults] = useState<boolean>(false);
    const [recommendedCareers, setRecommendedCareers] = useState<string[]>([]);
    const [isAIThinking, setIsAIThinking] = useState(false);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [infoDialogContent, setInfoDialogContent] = useState({ title: "", message: "" });
    const [careerType, setCareerType] = useState("");
    const [selectedCareer, setSelectedCareer] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState("");
    const [userName, setUserName] = useState<string>("Usuario");
    const [userGender, setUserGenderState] = useState<string>("0");

    useEffect(() => {
      const loadUserInfo = async () => {
        try {
          const userInfo = await getUserInfo(userId);
          if (userInfo?.user) {
            setUserName(`${userInfo.user.firstName} ${userInfo.user.lastName}`);
            // El género podría estar en userInfo.user.gender si existe
            setUserGenderState(userInfo.user.gender || "0");
          }
        } catch (error) {
          console.error("Error loading user info:", error);
        }
      };
      loadUserInfo();
    }, [userId]);

    useEffect(() => {
      setAllTestsCompleted(
        hollandResult?.currentQuestion === HOLLAND_QUESTIONS && chasideResult?.currentQuestion === CHASIDE_QUESTIONS,
      );
    }, [hollandResult?.currentQuestion, chasideResult?.currentQuestion]);

    useEffect(() => {
      const fetchCareers = async () => {
        try {
          const careers = await vocationalService.getCareers(userId);
          setRecommendedCareers(careers);
        } catch (error) {
          console.error("Error fetching careers:", error);
          setRecommendedCareers([]);
        }
      };

      fetchCareers();
    }, [userId]);

    useEffect(() => {
      const loadCompanyCharacteristics = async () => {
        try {
          const userInfo = await getUserInfo(getUserId());
          if (userInfo?.user?.companyCharacteristics) {
            const typeCareer = userInfo.user.companyCharacteristics.find(
              (char: CompanyCharacteristic) => char.name === "typeCareer",
            );
            if (typeCareer && (typeCareer.value === "p" || typeCareer.value === "t")) {
              setCareerType(typeCareer.value === "p" ? "profesional" : "tecnica");
            }
          }
        } catch (error) {
          console.error("Error loading company characteristics:", error);
        }
      };

      loadCompanyCharacteristics();
    }, []);

    const processResults = useCallback(async () => {
      if (!careerType) return;

      console.log(`[Frontend] Iniciando procesamiento de resultados para usuario ${userId}`);
      const startTime = Date.now();
      
      // Asegurar que el diálogo esté abierto
      setIsDialogOpen(true);
      setIsAIThinking(true);
      setIsLoading(true);
      setDisplayedResponse("");
      setAiResponse(""); // Limpiar respuesta anterior
      setProgress(0);
      setProgressMessage("🤖 Iniciando análisis...");

      let progressInterval: NodeJS.Timeout;
      let messageInterval: NodeJS.Timeout;
      let checkInterval: NodeJS.Timeout;
      let isCompleted = false;
      let result: any = null;

      // Función para completar el procesamiento
      const completeProcessing = (finalResult: any, isError = false) => {
        if (isCompleted) return;
        isCompleted = true;
        
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        clearInterval(checkInterval);
        
        // Asegurar que la barra llegue al 100% con animación
        setProgress(100);
        setProgressMessage(isError ? "❌ Error en el procesamiento" : "✅ ¡Análisis de IA completado!");
        
        // Esperar un momento para que el usuario vea el 100% antes de ocultar
        setTimeout(() => {
          if (finalResult && !isError) {
            // Establecer la respuesta y reiniciar displayedResponse para el efecto de escritura
            setAiResponse(finalResult.result);
            setDisplayedResponse(""); // Reiniciar para que el efecto de escritura funcione
            setExistingResults(false); // Asegurar que se muestre el efecto de escritura
            setAiResultsAvailable(true);
            vocationalService.getCareers(userId).then(updatedCareers => {
              setRecommendedCareers(updatedCareers);
            });
          } else if (isError) {
            const errorMessage = "Lo siento, hubo un error al procesar los resultados. Por favor, inténtalo de nuevo más tarde.";
            setAiResponse(errorMessage);
            setDisplayedResponse(""); // Reiniciar para el efecto de escritura
            setExistingResults(false);
          } else {
            const noResultsMessage = "Lo siento, no se encontraron resultados.";
            setAiResponse(noResultsMessage);
            setDisplayedResponse(""); // Reiniciar para el efecto de escritura
            setExistingResults(false);
          }
          
          setIsAIThinking(false);
          setIsLoading(false);
          
          // Resetear progreso después de un momento
          setTimeout(() => {
            setProgress(0);
            setProgressMessage("");
          }, 2000);
        }, 1500); // Esperar 1.5 segundos para que se vea el 100%
      };

      // Simular progreso durante 30 segundos máximo
      progressInterval = setInterval(() => {
        if (isCompleted) return;
        
        setProgress(prev => {
          if (prev >= 90) return prev; // No llegar al 100% hasta que termine
          return prev + Math.random() * 3; // Progreso más rápido para 30 segundos
        });
      }, 1000); // Cada 1 segundo

      // Actualizar mensajes de progreso con etapas específicas de IA
      const aiStages = [
        { message: "🔍 Analizando puntajes de las pruebas...", progress: 0 },
        { message: "🧠 Interpretando patrones de personalidad...", progress: 8 },
        { message: "🎯 Identificando fortalezas y habilidades...", progress: 16 },
        { message: "💼 Evaluando compatibilidad con carreras...", progress: 24 },
        { message: "📊 Analizando mercado laboral colombiano...", progress: 32 },
        { message: "🎓 Generando recomendaciones personalizadas...", progress: 40 },
        { message: "✨ Finalizando análisis vocacional...", progress: 48 },
        { message: "🔬 Procesando datos de inteligencia artificial...", progress: 56 },
        { message: "📈 Calculando probabilidades de éxito...", progress: 64 },
        { message: "🎨 Optimizando recomendaciones personalizadas...", progress: 72 },
        { message: "📋 Preparando informe detallado...", progress: 80 },
        { message: "🔍 Validando resultados del análisis...", progress: 88 },
        { message: "✨ Finalizando análisis vocacional...", progress: 96 }
      ];
      
      let currentStageIndex = 0;
      
      messageInterval = setInterval(() => {
        if (isCompleted) return;
        
        // Mostrar la etapa actual y avanzar a la siguiente
        setProgressMessage(aiStages[currentStageIndex].message);
        currentStageIndex = (currentStageIndex + 1) % aiStages.length;
      }, 4500); // Cada 4.5 segundos para cubrir 60 segundos con 13 mensajes

      // Verificar cada 10 segundos si el backend ya respondió
      checkInterval = setInterval(() => {
        if (isCompleted) return;
        
        console.log(`[Frontend] Verificando si el backend ya respondió...`);
        // Si tenemos resultado, completar inmediatamente
        if (result) {
          completeProcessing(result);
        }
      }, 10000); // Cada 10 segundos

      // Iniciar la llamada al backend
      try {
        result = await vocationalService.processResults({
          userId: userId,
          careerType,
          selectedCareer,
        });

        const endTime = Date.now();
        const processingTime = endTime - startTime;
        console.log(`[Frontend] Procesamiento completado en ${processingTime}ms para usuario ${userId}`);
        
        // Si el backend respondió antes de 30 segundos, completar inmediatamente
        if (!isCompleted) {
          completeProcessing(result);
        }
      } catch (error) {
        console.error("Error processing results:", error);
        if (!isCompleted) {
          completeProcessing(null, true);
        }
      }

      // Timeout de 90 segundos - si no se completó, forzar finalización
      setTimeout(() => {
        if (!isCompleted) {
          console.log(`[Frontend] Timeout de 90 segundos alcanzado`);
          completeProcessing(result);
        }
      }, 90000);
    }, [userId, careerType, selectedCareer, setAiResultsAvailable]);

    useEffect(() => {
      const checkExistingResults = async () => {
        try {
          const results = await vocationalService.getCareers(userId);
          if (results && Array.isArray(results) && results.length > 0) {
            setAiResultsAvailable(true);
            setRecommendedCareers(results);
          } else {
            setAiResultsAvailable(false);
            setRecommendedCareers([]);
          }
        } catch (error) {
          console.error("Error checking existing results:", error);
          setAiResultsAvailable(false);
        }
      };

      checkExistingResults();
    }, [userId, setAiResultsAvailable]);

    useEffect(() => {
      if (!aiResponse || !isDialogOpen) {
        // Si el diálogo se cierra o no hay respuesta, limpiar el texto mostrado
        if (!isDialogOpen) {
          setDisplayedResponse("");
        }
        return;
      }

      if (existingResults) {
        // Si son resultados existentes, mostrar todo de una vez
        setDisplayedResponse(aiResponse);
        return;
      }

      // Reiniciar displayedResponse para el efecto de escritura
      setDisplayedResponse("");
      
      // Pequeño delay para asegurar que el overlay se haya cerrado
      let intervalId: NodeJS.Timeout | null = null;
      const timeoutId = setTimeout(() => {
        // Efecto de escritura tipo máquina
        let index = 0;
        intervalId = setInterval(() => {
          if (index < aiResponse.length) {
            // Usar substring para construir el texto progresivamente
            setDisplayedResponse(aiResponse.substring(0, index + 1));
            index++;
          } else {
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        }, 2); // Velocidad de escritura
      }, 100); // Pequeño delay para asegurar que el overlay se haya cerrado

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [aiResponse, isDialogOpen, existingResults]);

    const showInfoDialog = (title: string, message: string) => {
      setInfoDialogContent({ title, message });
      setIsInfoDialogOpen(true);
    };

    const checkResults = useCallback(async () => {
      setIsLoading(true);
      try {
        const aiResults = await vocationalService.getCareers(userId);

        if (aiResults && Array.isArray(aiResults) && aiResults.length > 0) {
          setExistingResults(true);
          setRecommendedCareers(aiResults);

          const results = await vocationalService.processResults({
            userId: userId,
            careerType: "",
            selectedCareer: "",
          });

          if (results?.result) {
            setAiResponse(results.result);
            setDisplayedResponse(results.result);
          }
        } else {
          setExistingResults(false);
          setAiResponse("");
          setDisplayedResponse("");
          setRecommendedCareers([]);
        }
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Error checking results:", error);
        setExistingResults(false);
        setAiResponse("");
        setDisplayedResponse("");
        setRecommendedCareers([]);
        setIsDialogOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, [userId]);

    const handleViewCareerComparisonClick = () => {
      const careers: Career[] = recommendedCareers.map(name => ({
        name,
        universities: []
      }));
      handleViewCareerComparison(careers);
      setIsCareerComparisonDialogOpen(true);
    };

    return (
      <>
        {/* Botón IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full border-2 border-purple-500/30 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 hover:border-purple-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
                  <Stars className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">Análisis con IA</h4>
                  <p className="text-xs text-muted-foreground">
                    Obtén recomendaciones personalizadas de carreras basadas en tus resultados
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!allTestsCompleted) {
                      showInfoDialog(
                        "Acción requerida",
                        "Para procesar los resultados con IA, primero debes completar todas las pruebas de Holland y CHASIDE.",
                      );
                    } else if (isAIThinking) {
                      showInfoDialog("Procesando", "La IA está procesando los resultados. Por favor, espera.");
                    } else {
                      // Abrir el diálogo directamente para procesar
                      setIsDialogOpen(true);
                      // Si ya hay resultados, cargarlos
                      checkResults();
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Stars className="h-5 w-5 group-hover:animate-spin transition-all duration-300" />
                      <span className="relative z-10">Procesar con IA</span>
                    </>
                  )}
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botón Empleo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:border-green-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">Datos de Empleo</h4>
                  <p className="text-xs text-muted-foreground">
                    Visualiza estadísticas de empleo, salarios y demanda laboral por carrera
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!aiResultsAvailable) {
                      showInfoDialog(
                        "Acción requerida",
                        "Para ver los datos de empleo, primero debes procesar los resultados con IA.",
                      );
                    } else {
                      setIsEmploymentDialogOpen(true);
                    }
                  }}
                  disabled={!aiResultsAvailable}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Ver Empleo</span>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botón Costos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-full border-2 border-orange-500/30 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 hover:border-orange-500/60 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">Comparar Costos</h4>
                  <p className="text-xs text-muted-foreground">
                    Compara los costos de matrícula y programas entre diferentes universidades
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!aiResultsAvailable) {
                      showInfoDialog(
                        "Acción requerida",
                        "Para comparar los costos de carreras, primero debes procesar los resultados con IA.",
                      );
                    } else {
                      setIsCarrerCostsDialogOpen(true);
                    }
                  }}
                  disabled={!aiResultsAvailable}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                >
                  <FileText className="h-5 w-5" />
                  <span>Ver Costos</span>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Results Dialog */}
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open: boolean) => {
            // No permitir cerrar el modal mientras se está procesando
            if (!isAIThinking && !isLoading) {
              setIsDialogOpen(open);
            }
          }}
        >
          <DialogContent 
            className="max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl"
            onEscapeKeyDown={(e) => {
              // No permitir cerrar con Escape mientras se está procesando
              if (isAIThinking || isLoading) {
                e.preventDefault();
              }
            }}
            onInteractOutside={(e) => {
              // No permitir cerrar haciendo clic fuera mientras se está procesando
              if (isAIThinking || isLoading) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Resultados de {userName}
              </DialogTitle>
              <DialogDescription className="text-lg mb-6 text-center">
                Análisis de IA basado en tus pruebas de orientación vocacional
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <Alert variant="destructive" className="bg-card text-card-foreground w-full mt-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription className="text-gray-500">
                  "Los siguientes resultados generados por nuestra plataforma, que integra inteligencia artificial, son
                  únicamente recomendaciones orientativas. La elección final y matrícula de tu carrera universitaria es
                  una decisión personal y exclusiva del estudiante y/o su familia. No nos hacemos responsables por
                  decisiones basadas en estas sugerencias".
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                  {!existingResults && !displayedResponse ? (
                    <>
                      <div className="space-y-4">
                        {!careerType && (
                          <>
                            <b className="text-gray-700 font-lg block text-center">
                              Antes de procesar tus resultados indícanos que tipo de carrera te gustaría estudiar.
                            </b>
                            <div className="space-y-4">
                              <b className="text-gray-600">Carrera técnica:</b> Formación de corta duración (1-3 años)
                              que capacita a los estudiantes en habilidades prácticas y específicas para desempeñarse en
                              campos técnicos o tecnológicos. <br />
                              <b className="text-gray-600">Carrera profesional:</b> Formación de mayor duración (4-6
                              años) que ofrece una educación integral, académica y especializada para asumir roles de
                              responsabilidad y liderazgo en diversas áreas profesionales.
                              <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Select onValueChange={(value) => setCareerType(value)}>
                                  <SelectTrigger className="w-full pl-10 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-gray-500 transition-all duration-300">
                                    <SelectValue placeholder="Selecciona el tipo de carrera" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-600 rounded-xl">
                                    <SelectItem value="profesional" className="hover:bg-blue-50 dark:hover:bg-gray-700">Carrera Profesional</SelectItem>
                                    <SelectItem value="tecnica" className="hover:bg-blue-50 dark:hover:bg-gray-700">Carrera Técnica</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </>
                        )}
                        {/* Pregunta sobre habilidades blandas */}
                        <div className="relative hidden">
                          <Stars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <div className="flex items-center">
                            <Input
                              placeholder="¿Cuál crees que es tu mayor fortaleza? (Esta pregunta es opcional, puedes dejarla en blanco). "
                              value={selectedCareer}
                              onChange={(e) => setSelectedCareer(e.target.value)}
                              className="pl-10 w-full"
                              maxLength={100}
                            />
                            <Popover open={isOpen} onOpenChange={setIsOpen}>
                              <PopoverTrigger asChild>
                                <Info
                                  className="h-5 w-5 ml-2 text-muted-foreground cursor-pointer flex-shrink-0"
                                  onMouseEnter={() => setIsOpen(true)}
                                  onMouseLeave={() => setIsOpen(false)}
                                />
                              </PopoverTrigger>
                              <PopoverContent
                                className="max-w-xs"
                                onMouseEnter={() => setIsOpen(true)}
                                onMouseLeave={() => setIsOpen(false)}
                                side="right"
                                align="start"
                              >
                                <p className="text-sm">
                                  Menciona aquí alguna habilidad blanda en la que destacas, como comunicación,
                                  liderazgo, creatividad, resolución de problemas, trabajo en equipo, adaptabilidad, o
                                  cualquier otra cualidad personal que consideres una de tus fortalezas principales.
                                </p>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: (isAIThinking || isLoading) ? 1 : 1.02 }}
                          whileTap={{ scale: (isAIThinking || isLoading) ? 1 : 0.98 }}
                          onClick={processResults}
                          disabled={!careerType || isAIThinking || isLoading}
                          className={`w-full font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                            !careerType || isAIThinking || isLoading
                              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white hover:shadow-xl'
                          }`}
                        >
                          <Sparkles className="h-5 w-5" />
                          <span>
                            {isAIThinking || isLoading ? 'Procesando con IA...' : 'Procesar resultados con IA'}
                          </span>
                        </motion.button>
                      </div>
                    </>
                  ) : null}
                  {displayedResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm"
                    >
                      <motion.p
                        className="text-lg leading-relaxed whitespace-pre-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <TextFormatter text={displayedResponse} />
                      </motion.p>
                    </motion.div>
                  )}
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: isAIThinking || isLoading ? 1 : 1.05, y: isAIThinking || isLoading ? 0 : -2 }}
                whileTap={{ scale: isAIThinking || isLoading ? 1 : 0.95 }}
                onClick={() => {
                  // No permitir cerrar mientras se está procesando
                  if (!isAIThinking && !isLoading) {
                    setIsDialogOpen(false);
                  }
                }}
                disabled={isAIThinking || isLoading}
                className={`font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 ${
                  isAIThinking || isLoading 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white hover:shadow-xl'
                }`}
              >
                {isAIThinking || isLoading ? 'Procesando...' : 'Cerrar'}
              </motion.button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Employment Dashboard Dialog */}
        <Dialog open={isEmploymentDialogOpen} onOpenChange={setIsEmploymentDialogOpen}>
          <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
            <DialogTitle></DialogTitle>
            <SalaryDataVisualization gender={userGender} careers={mapCareersToFields(recommendedCareers)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isCarrerCostsDialogOpen} onOpenChange={(open) => setIsCarrerCostsDialogOpen(open)}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogTitle></DialogTitle>
            <CareerComparison recommendedCareers={recommendedCareers.map(name => ({ name, universities: [] }))} />
          </DialogContent>
        </Dialog>
        {/* Diálogo de información */}
        <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{infoDialogContent.title}</DialogTitle>
              <DialogDescription>{infoDialogContent.message}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsInfoDialogOpen(false)}>Entendido</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[100]">
            <LoadingCard />
          </div>
        )}

        {/* Career Comparison Dialog */}
        <Dialog open={isCareerComparisonDialogOpen} onOpenChange={(open) => setIsCareerComparisonDialogOpen(open)}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogTitle></DialogTitle>
            <CareerComparison recommendedCareers={recommendedCareers.map(name => ({ name, universities: [] }))} />
          </DialogContent>
        </Dialog>

        {/* AI Thinking Overlay - Renderizado directamente en el body usando portal */}
        {isAIThinking && createPortal(
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center" 
            style={{ zIndex: 999999 }}
          >
            <AIThinkingOverlay 
              isVisible={isAIThinking} 
              progress={progress}
              progressMessage={progressMessage}
            />
          </div>,
          document.body
        )}
      </>
    );
  },
);

export default memo(function Results({
  userId,
  subscriptions,
}: {
  userId: string;
  subscriptions: Subscription[];
}) {
  const [userResult, setUserResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResultsAvailable, setAiResultsAvailable] = useState<boolean>(false);
  const [isProjectKitOpen, setIsProjectKitOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([]);
  const [showCareerComparison, setShowCareerComparison] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [projectKitMountCounter, setProjectKitMountCounter] = useState(0);
  const lastFetchRef = useRef<number>(0);
  const FETCH_INTERVAL = 300000; // 5 minutos
  const MIN_FETCH_INTERVAL = 10000; // 10 segundos

  const handleViewCareerComparison = (careers: Career[]) => {
    setSelectedCareers(careers);
  };

  const openProjectKit = useCallback(() => {
    setIsProjectKitOpen(false);
    setTimeout(() => {
      setProjectKitMountCounter((prev) => prev + 1);
      setIsProjectKitOpen(true);
    }, 50);
  }, []);

  const fetchResults = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && now - lastFetchRef.current < MIN_FETCH_INTERVAL) {
      return;
    }

    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const timestamp = now;
      const response = await resultService.getResults(userId, timestamp);

      if (response?.userResult) {
        setUserResult(response.userResult);
        lastFetchRef.current = now;
      } else {
        setError("Unexpected data format. Please try again later.");
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again later.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();

    pollIntervalRef.current = setInterval(() => {
      fetchResults();
    }, FETCH_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchResults();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchResults]);

  const hasSubscription = useMemo(() => {
    return subscriptions.some((sub) => sub.moduleId === "678d625ce2695682ef90951b");
  }, [subscriptions]);

  const showProjectKit = useMemo(() => {
    return (
      hasSubscription &&
      userResult &&
      userResult.hollandResult?.currentQuestion === HOLLAND_QUESTIONS &&
      userResult.chasideResult?.currentQuestion === CHASIDE_QUESTIONS &&
      aiResultsAvailable
    );
  }, [hasSubscription, userResult, aiResultsAvailable]);

  const breadcrumbItems = [
    {
      label: "Orientación Vocacional",
      href: "/vocational-guidance",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Resultados",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  if (loading) {
    return (
      <PageContainer
        title="Cargando resultados"
        description="Estamos recuperando los resultados de las pruebas vocacionales..."
        breadcrumbItems={breadcrumbItems}
      >
        <LoadingCard />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Error"
        description="Ha ocurrido un error al cargar los resultados"
        breadcrumbItems={breadcrumbItems}
      >
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <Button onClick={() => fetchResults(true)} className="mt-4" variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Resultados de las Pruebas Vocacionales"
      description="Visualiza y analiza los resultados de tus pruebas vocacionales."
      breadcrumbItems={breadcrumbItems}
      icon={<FileText className="h-6 w-6" />}
    >
      {userResult && (
        <div className="space-y-4">
          {/* Header compacto */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tus Resultados Vocacionales
            </h2>
            <p className="text-muted-foreground text-sm">Análisis completo de orientación vocacional</p>
          </div>

          {/* Tarjetas de Estado de Pruebas - Compactas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prueba Holland */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                userResult.hollandResult?.currentQuestion === HOLLAND_QUESTIONS
                  ? "border-green-500/60 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20"
                  : "border-orange-500/60 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    userResult.hollandResult?.currentQuestion === HOLLAND_QUESTIONS
                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                      : "bg-gradient-to-br from-orange-500 to-amber-600"
                  }`}>
                    {userResult.hollandResult?.currentQuestion === HOLLAND_QUESTIONS ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <XCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">Prueba Holland</h3>
                    <Badge 
                      variant={userResult.hollandResult?.currentQuestion === HOLLAND_QUESTIONS ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {userResult.hollandResult?.currentQuestion === HOLLAND_QUESTIONS ? "Completada" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Prueba CHASIDE */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                userResult.chasideResult?.currentQuestion === CHASIDE_QUESTIONS
                  ? "border-green-500/60 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20"
                  : "border-orange-500/60 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    userResult.chasideResult?.currentQuestion === CHASIDE_QUESTIONS
                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                      : "bg-gradient-to-br from-orange-500 to-amber-600"
                  }`}>
                    {userResult.chasideResult?.currentQuestion === CHASIDE_QUESTIONS ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <XCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">Prueba CHASIDE</h3>
                    <Badge 
                      variant={userResult.chasideResult?.currentQuestion === CHASIDE_QUESTIONS ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {userResult.chasideResult?.currentQuestion === CHASIDE_QUESTIONS ? "Completada" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Acciones - Compactas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border pt-4"
          >
            <div className="mb-4 text-center">
              <h3 className="text-xl font-bold mb-1">Herramientas de Análisis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UserRow
                key={userId}
                userId={userId}
                hollandResult={userResult.hollandResult}
                chasideResult={userResult.chasideResult}
                aiResultsAvailable={aiResultsAvailable}
                setAiResultsAvailable={setAiResultsAvailable}
                handleViewCareerComparison={handleViewCareerComparison}
              />
            </div>
          </motion.div>
        </div>
      )}

      {isProjectKitOpen && (
        <Dialog
          key={`dialog-${projectKitMountCounter}`}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setIsProjectKitOpen(false);
            }
          }}
        >
          <DialogContent
            className="max-w-[90vw] max-h-[90vh] overflow-y-auto p-6"
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <ProjectKit
              key={`project-kit-${projectKitMountCounter}`}
              userId={userId}
              forceRefresh={projectKitMountCounter}
              onClose={() => setIsProjectKitOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {false && showProjectKit && (
        <Card className="mt-6 overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center space-x-2"
              >
                <span>¡Felicidades!</span>
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Stars className="h-12 w-12 text-yellow-400 animate-spin-slow transition-all mx-auto mb-4" />
              <p className="text-lg mb-4">
                Has desbloqueado el acceso al Kit Proyecto de Vida Juvenil por completar el módulo de Orientación
                Vocacional con la suscripción
                correspondiente.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Tu-Mentor.com ofrece este material gratuitamente como un valor agregado tras completar el módulo de
                exploración vocacional. Se trata de un marco de referencia no personalizado que puedes implementar
                parcial o totalmente, según tus necesidades.
              </p>
              <Button
                onClick={openProjectKit}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Acceder al Kit Proyecto de Vida Juvenil
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
});

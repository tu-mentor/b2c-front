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
import { Radar } from "react-chartjs-2";
import { getUserId, getUserInfo } from "../../../../services/auth-service";
import { vocationalService } from "../../../../services/vocational-service";
import { resultService } from "../../../../services/vocational-test/result-service";
import type { ChildModel, CompanyCharacteristic } from "../../../../types/auth-types";
import type { ChildSubscription } from "../../../../types/suscriptions";
import { Alert, AlertDescription, AlertTitle } from "../../../shared/alert";
import { Avatar, AvatarFallback } from "../../../shared/avatar";
import { Badge } from "../../../shared/badge";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../shared/tooltip";
import ProjectKit from "../../project-kit/project-kit";
import CareerComparison from "../career-costs/career-comparison";
import { mapCareersToFields } from "../career-field-mapping";
import { questions as chasideQuestions } from "../chaside/chaside-data";
import { questions as hollandQuestions } from "../holland/holland-data";
import SalaryDataVisualization from "../salary-employment-dashboard/SalaryDataVisualization";
import type {
  ChasideScores,
  ChildResult,
  ChildRowProps,
  HollandScores,
  TestResultsProps,
} from "../types/results-types";
import TextFormatter from "./format-text";
import {
  chasideColors,
  chasideDescriptions,
  chasideLabels,
  hollandColors,
  hollandDescriptions,
  hollandLabels,
} from "./results-constants";
import AIThinkingOverlay from "./AIThinkingOverlay";
import { PageContainer } from "../../../shared/page-container";
import { Career } from "../career-costs/types_career";

const HOLLAND_QUESTIONS = hollandQuestions.length;
const CHASIDE_QUESTIONS = chasideQuestions.length;

const TestResults: React.FC<TestResultsProps> = ({ hollandResult, chasideResult }) => {
  const hollandData = {
    labels: Object.values(hollandLabels),
    datasets: [
      {
        label: "Puntuaciones Holland",
        data: hollandResult ? Object.values(hollandResult.scores) : [],
        backgroundColor: Object.values(hollandColors),
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 2,
      },
    ],
  };

  const chasideData = {
    labels: Object.values(chasideLabels),
    datasets: [
      {
        label: "Puntuaciones CHASIDE",
        data: chasideResult ? Object.values(chasideResult.scores) : [],
        backgroundColor: Object.values(chasideColors),
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
        pointLabels: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r;
            }
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Tabs defaultValue="holland" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="holland" className="text-sm">
          Prueba Holland
        </TabsTrigger>
        <TabsTrigger value="chaside" className="text-sm">
          Prueba CHASIDE
        </TabsTrigger>
      </TabsList>
      <TabsContent value="holland" className="mt-0">
        {hollandResult ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-[250px] sm:h-[300px]">
              <Radar data={hollandData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(hollandResult.scores).map(([key, value]) => (
                <motion.div
                  key={key}
                  className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-sm font-medium">{hollandLabels[key as keyof HollandScores]}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold">{value}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{hollandDescriptions[key as keyof HollandScores]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <p className="text-center py-4 text-sm">No hay resultados disponibles para la prueba Holland.</p>
        )}
      </TabsContent>
      <TabsContent value="chaside" className="mt-0">
        {chasideResult ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-[250px] sm:h-[300px]">
              <Radar data={chasideData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(chasideResult.scores).map(([key, value]) => (
                <motion.div
                  key={key}
                  className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-sm font-medium">{chasideLabels[key as keyof ChasideScores]}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold">{value}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{chasideDescriptions[key as keyof ChasideScores]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <p className="text-center py-4 text-sm">No hay resultados disponibles para la prueba CHASIDE.</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

const ChildRow = memo(
  ({ child, hollandResult, chasideResult, aiResultsAvailable, setAiResultsAvailable, handleViewCareerComparison }: ChildRowProps) => {
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
    const [childGender, setChildGender] = useState<number>(child.gender === "male" ? 1 : 0);
    const [isAIThinking, setIsAIThinking] = useState(false);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [infoDialogContent, setInfoDialogContent] = useState({ title: "", message: "" });
    const [careerType, setCareerType] = useState("");
    const [selectedCareer, setSelectedCareer] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState("");

    useEffect(() => {
      setAllTestsCompleted(
        hollandResult?.currentQuestion === HOLLAND_QUESTIONS && chasideResult?.currentQuestion === CHASIDE_QUESTIONS,
      );
    }, [hollandResult?.currentQuestion, chasideResult?.currentQuestion]);

    useEffect(() => {
      const fetchCareers = async () => {
        try {
          const careers = await vocationalService.getCareers(getUserId(), child.id);
          setRecommendedCareers(careers);
        } catch (error) {
          console.error("Error fetching careers:", error);
          setRecommendedCareers([]);
        }
      };

      fetchCareers();
      setChildGender(child.gender === "male" ? 1 : 0);
    }, [child]);

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

      console.log(`[Frontend] Iniciando procesamiento de resultados para ${child.childName}`);
      const startTime = Date.now();
      
      setIsAIThinking(true);
      setIsLoading(true);
      setDisplayedResponse("");
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
            setAiResponse(finalResult.result);
            setAiResultsAvailable((prev) => ({ ...prev, [child.id]: true }));
            vocationalService.getCareers(getUserId(), child.id).then(updatedCareers => {
              setRecommendedCareers(updatedCareers);
            });
          } else if (isError) {
            setAiResponse("Lo siento, hubo un error al procesar los resultados. Por favor, inténtalo de nuevo más tarde.");
            setDisplayedResponse(
              "Lo siento, hubo un error al procesar los resultados. Por favor, inténtalo de nuevo más tarde.",
            );
          } else {
            setAiResponse("Lo siento, no se encontraron resultados.");
            setDisplayedResponse("Lo siento, no se encontraron resultados.");
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
          userId: getUserId(),
          childId: child.id,
          careerType,
          selectedCareer,
        });

        const endTime = Date.now();
        const processingTime = endTime - startTime;
        console.log(`[Frontend] Procesamiento completado en ${processingTime}ms para ${child.childName}`);
        
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
    }, [child.id, careerType, selectedCareer, setAiResultsAvailable]);

    useEffect(() => {
      const checkExistingResults = async () => {
        try {
          const results = await vocationalService.getCareers(getUserId(), child.id);
          if (results && Array.isArray(results) && results.length > 0) {
            setAiResultsAvailable((prev) => ({ ...prev, [child.id]: true }));
            setRecommendedCareers(results);
          } else {
            setAiResultsAvailable((prev) => ({ ...prev, [child.id]: false }));
            setRecommendedCareers([]);
          }
        } catch (error) {
          console.error("Error checking existing results:", error);
          setAiResultsAvailable((prev) => ({ ...prev, [child.id]: false }));
        }
      };

      checkExistingResults();
    }, [child.id, setAiResultsAvailable]);

    useEffect(() => {
      if (!aiResponse || !isDialogOpen) return;

      if (existingResults) {
        setDisplayedResponse(aiResponse);
        return;
      }

      let index = 0;
      const intervalId = setInterval(() => {
        if (index < aiResponse.length) {
          setDisplayedResponse((prev) => prev + aiResponse[index]);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 2); // Reducido de 5ms a 2ms para animación más rápida

      return () => clearInterval(intervalId);
    }, [aiResponse, isDialogOpen, existingResults]);

    const showInfoDialog = (title: string, message: string) => {
      setInfoDialogContent({ title, message });
      setIsInfoDialogOpen(true);
    };

    const checkResults = useCallback(async () => {
      setIsLoading(true);
      try {
        const aiResults = await vocationalService.getCareers(getUserId(), child.id);

        if (aiResults && Array.isArray(aiResults) && aiResults.length > 0) {
          setExistingResults(true);
          setRecommendedCareers(aiResults);

          const results = await vocationalService.processResults({
            userId: getUserId(),
            childId: child.id,
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
    }, [child.id]);

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
        <TableRow className="hover:bg-muted/50 transition-colors group">
          <TableCell className="font-medium">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span>{child.childName}</span>
            </div>
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            {hollandResult && hollandResult.currentQuestion === HOLLAND_QUESTIONS ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 rounded-full font-semibold">
                  <CheckCircle className="h-3 w-3" />
                  <span>Completada</span>
                </Badge>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white border-0 px-3 py-1 rounded-full font-semibold">
                  <XCircle className="h-3 w-3" />
                  <span>Pendiente</span>
                </Badge>
              </motion.div>
            )}
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            {chasideResult && chasideResult.currentQuestion === CHASIDE_QUESTIONS ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 rounded-full font-semibold">
                  <CheckCircle className="h-3 w-3" />
                  <span>Completada</span>
                </Badge>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white border-0 px-3 py-1 rounded-full font-semibold">
                  <XCircle className="h-3 w-3" />
                  <span>Pendiente</span>
                </Badge>
              </motion.div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                          checkResults();
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    >
                      {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <Stars className="h-4 w-4 group-hover:animate-spin transition-all duration-300" />
                          <span className="relative z-10">IA</span>
                        </>
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Procesar resultados con IA</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!aiResultsAvailable[child.id]) {
                          showInfoDialog(
                            "Acción requerida",
                            "Para ver los datos de empleo, primero debes procesar los resultados con IA.",
                          );
                        } else {
                          setIsEmploymentDialogOpen(true);
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Empleo</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver datos de empleo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (!aiResultsAvailable[child.id]) {
                          showInfoDialog(
                            "Acción requerida",
                            "Para comparar los costos de carreras, primero debes procesar los resultados con IA.",
                          );
                        } else {
                          setIsCarrerCostsDialogOpen(true);
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Costos</span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Comparar costos de carreras</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableCell>
        </TableRow>

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
                Resultados de {child.childName}
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
          <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto">
            <DialogTitle></DialogTitle>
            <SalaryDataVisualization gender={child.gender} careers={mapCareersToFields(recommendedCareers)} />
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
  children,
  subscriptions,
  selectedChildId,
}: {
  children: ChildModel[];
  subscriptions: ChildSubscription[];
  selectedChildId: string;
}) {
  const [childrenResults, setChildrenResults] = useState<ChildResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiResultsAvailable, setAiResultsAvailable] = useState<Record<string, boolean>>({});
  const [isProjectKitOpen, setIsProjectKitOpen] = useState(false);
  const [filteredChildren, setFilteredChildren] = useState<ChildModel[]>([]);
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
      const response = await resultService.getResults(getUserId(), timestamp);

      if (response?.childrenResults?.length) {
        setChildrenResults(response.childrenResults);
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

  useEffect(() => {
    const filteredIds = subscriptions
      .filter((sub) => sub.subscriptions.some((s: { moduleId: string }) => s.moduleId === "678d625ce2695682ef90951b"))
      .map((sub) => sub.childId);

    setFilteredChildren(children.filter((child) => filteredIds.includes(child.id)));
  }, [children, subscriptions]);

  const showProjectKit = useMemo(() => {
    return (
      filteredChildren.length > 0 &&
      filteredChildren.some((child) => {
        if (child.id !== selectedChildId) return false;
        const result = childrenResults.find((r) => r.child._id === child.id);
        return (
          result &&
          result.hollandResult?.currentQuestion === HOLLAND_QUESTIONS &&
          result.chasideResult?.currentQuestion === CHASIDE_QUESTIONS &&
          aiResultsAvailable[child.id]
        );
      })
    );
  }, [filteredChildren, selectedChildId, childrenResults, aiResultsAvailable]);

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
      description="Visualiza y analiza los resultados de las pruebas vocacionales de tus hijos."
      breadcrumbItems={breadcrumbItems}
      icon={<FileText className="h-6 w-6" />}
    >
      <Card className="w-full mx-auto bg-white dark:bg-gray-800 overflow-hidden border-0 shadow-xl rounded-2xl">
        <CardContent className="p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Nombre del hijo</TableHead>
                  <TableHead className="hidden sm:table-cell w-[20%]">Prueba Holland</TableHead>
                  <TableHead className="hidden sm:table-cell w-[20%]">Prueba CHASIDE</TableHead>
                  <TableHead className="w-[40%]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map((child) => {
                  const result = childrenResults.find((r) => r.child._id === child.id);
                  return result ? (
                    <ChildRow
                      key={child.id}
                      child={child}
                      hollandResult={result.hollandResult}
                      chasideResult={result.chasideResult}
                      aiResultsAvailable={aiResultsAvailable}
                      setAiResultsAvailable={setAiResultsAvailable}
                      handleViewCareerComparison={handleViewCareerComparison}
                    />
                  ) : null;
                })}
              </TableBody>
            </Table>
          </motion.div>
        </CardContent>
      </Card>

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
              children={children}
              selectedChildId={selectedChildId}
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
                Vocacional para {childrenResults.length === 1 ? "tu hijo" : "tus hijos"} con la suscripción
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

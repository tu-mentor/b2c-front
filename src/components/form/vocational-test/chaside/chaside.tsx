import {
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
} from "chart.js";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Check, X, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getUserId, getUserInfo } from "../../../../services/auth-service";
import { chasideTestService } from "../../../../services/vocational-test/chaside-service";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
import { LoadingCard } from "../../../shared/loading/loading-card";
import { Progress } from "../../../shared/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../shared/tooltip";
import {
  personalityDescriptions,
  personalityDetails,
  personalityIcons,
  personalityMeanings,
} from "./chaside-constants";
import { type PersonalityType, questions } from "./chaside-data";
import { PageContainer } from "@/components/shared/page-container";
import { GraduationCap, Lightbulb } from "lucide-react";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

const saveOrUpdateTestProgress = async (
  id: string | null,
  userId: string,
  currentQuestion: number,
  scores: Record<PersonalityType, number>
): Promise<string> => {
  const maxScore = Math.max(...Object.values(scores));
  const dominantType = Object.entries(scores).find(
    ([_, score]) => score === maxScore
  )?.[0] as PersonalityType;
  const recommendedCareers = personalityDetails[dominantType].careers
    .slice(0, 3)
    .map((career) => career.text);

  const data = {
    userId,
    currentQuestion,
    scores: {
      C: scores.C,
      H: scores.H,
      A: scores.A,
      S: scores.S,
      I: scores.I,
      D: scores.D,
      E: scores.E,
    },
    careers: recommendedCareers,
  };

  if (id) {
    await chasideTestService.updateChasideTest(id, data);
    return id;
  } else {
    const newChaside = await chasideTestService.createChasideTest(data);
    return newChaside.id;
  }
};

function debounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timeout) {
      clearTimeout(timeout);
    }

    return new Promise((resolve) => {
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result as ReturnType<T>);
      }, wait);
    });
  };
}

const debouncedSaveOrUpdateTestProgress = debounce(saveOrUpdateTestProgress, 0);

const loadSavedProgress = async (
  userId: string
): Promise<{
  id: string;
  currentQuestion: number;
  scores: Record<PersonalityType, number>;
} | null> => {
  try {
    const savedData = await chasideTestService.getChasideTestByUserId(userId);
    if (savedData) {
      return {
        id: savedData.id,
        currentQuestion: savedData.currentQuestion,
        scores: {
          C: savedData.scores.C,
          H: savedData.scores.H,
          A: savedData.scores.A,
          S: savedData.scores.S,
          I: savedData.scores.I,
          D: savedData.scores.D,
          E: savedData.scores.E,
        },
      };
    }
  } catch (error) {}
  return null;
};

export default function ChasideVocationalTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<PersonalityType, number>>({
    C: 0,
    H: 0,
    A: 0,
    S: 0,
    I: 0,
    D: 0,
    E: 0,
  });
  const [showResults, setShowResults] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dominantType, setDominantType] = useState<PersonalityType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const breadcrumbItems = [
    {
      label: "Orientación Vocacional",
      href: "/vocational-guidance",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Prueba CHASIDE",
      icon: <Lightbulb className="h-4 w-4" />,
    },
  ];

  // Función para actualizar los datos desde la API
  const refreshData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const userInfo = await getUserInfo(getUserId());

      if (userInfo?.user.id) {
        setUserId(userInfo.user.id);

        try {
          const savedProgress = await loadSavedProgress(userInfo.user.id);

          if (savedProgress) {
            setId(savedProgress.id);
            setCurrentQuestion(savedProgress.currentQuestion);
            setScores(savedProgress.scores);

            if (savedProgress.currentQuestion >= questions.length) {
              setShowResults(true);
            } else {
              setShowResults(false);
            }
          } else {
            // Si no hay progreso guardado, reiniciar todo
            setId(null);
            setCurrentQuestion(0);
            setScores({
              C: 0,
              H: 0,
              A: 0,
              S: 0,
              I: 0,
              D: 0,
              E: 0,
            });
            setShowResults(false);
          }
        } catch (error) {
          console.error("Error loading saved progress:", error);
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Este useEffect se ejecuta cada vez que el componente se monta
  useEffect(() => {
    refreshData();

    // Configurar el polling para actualizar los datos menos frecuentemente
    pollIntervalRef.current = setInterval(() => {
      refreshData();
    }, 300000); // Aumentar de 240000ms (4 minutos) a 300000ms (5 minutos)

    // Implementar un método para refrescar cuando el componente vuelva a estar visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Limpiar el intervalo y el event listener cuando el componente se desmonte
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const maxScore = Math.max(...Object.values(scores));
    const dominant = Object.entries(scores).find(
      ([_, score]) => score === maxScore
    )?.[0] as PersonalityType;
    setDominantType(dominant);
  }, [scores]);

  const handleAnswer = async (answer: boolean) => {
    if (isLoading || !userId || isSaving) return;

    setIsSaving(true);

    try {
      const newScores = { ...scores };
      if (answer) {
        newScores[questions[currentQuestion].type] += 1;
      }
      setScores(newScores);

      const newCurrentQuestion = currentQuestion + 1;

      if (newCurrentQuestion >= questions.length) {
        setShowResults(true);

        const chasideId = await debouncedSaveOrUpdateTestProgress(
          id,
          userId,
          newCurrentQuestion,
          newScores
        );
        setId(chasideId);
      } else {
        setCurrentQuestion(newCurrentQuestion);

        const chasideId = await debouncedSaveOrUpdateTestProgress(
          id,
          userId,
          newCurrentQuestion,
          newScores
        );
        setId(chasideId);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = async () => {
    if (currentQuestion > 0 && userId && !isSaving) {
      setIsSaving(true);

      try {
        const newCurrentQuestion = currentQuestion - 1;
        setCurrentQuestion(newCurrentQuestion);
        const question = questions[newCurrentQuestion];
        const newScores = {
          ...scores,
          [question.type]: Math.max(0, scores[question.type] - 1),
        };
        setScores(newScores);

        await debouncedSaveOrUpdateTestProgress(id, userId, newCurrentQuestion, newScores);
      } catch (error) {
        console.error("Error saving progress:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const chartData = {
    labels: Object.keys(scores),
    datasets: [
      {
        label: "Tu perfil CHASIDE",
        data: Object.values(scores),
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Cargando tu test CHASIDE"
        description="Estamos recuperando tus datos desde la base de datos..."
        breadcrumbItems={breadcrumbItems}
      >
        <LoadingCard />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={showResults ? "Resultados de tu Test Vocacional CHASIDE" : "Descubre tu perfil profesional ideal"}
      description={!showResults ? "Esta herramienta te ayudará a identificar tus fortalezas y áreas de interés para encontrar la carrera perfecta para ti." : undefined}
      breadcrumbItems={breadcrumbItems}
      icon={<Lightbulb className="h-6 w-6" />}
    >
      <div className="w-full mx-auto text-center container max-w-7xl space-y-4">
          {!showResults && (
            <p className="mb-6 text-base md:text-lg text-gray-600 dark:text-gray-300">
          
            </p>
          )}
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Pregunta {currentQuestion + 1} de {questions.length}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-inner overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ borderRadius: '9999px' }}
                      />
                    </div>
                  </div>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-border p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="w-full text-left">
                          <h3 className="text-base font-bold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                            <span className="mr-2 text-lg">❓</span>
                            Responde la siguiente pregunta
                          </h3>
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-blue-200 dark:border-gray-600">
                            <div className="flex items-center justify-center mb-3">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                                {personalityIcons[questions[currentQuestion]?.type as PersonalityType]}
                                <span className="ml-2">
                                  {questions[currentQuestion]?.type} - {personalityMeanings[questions[currentQuestion]?.type as PersonalityType]}
                                </span>
                              </span>
                            </div>
                            <p className="text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                              {currentQuestion < questions.length
                                ? questions[currentQuestion].text
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="w-full text-left">
                          <h3 className="text-base font-semibold mb-2 text-primary dark:text-primary-foreground">
                            Tu respuesta
                          </h3>
                          <div className="flex space-x-4">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.button
                                    whileHover={{ scale: isSaving ? 1 : 1.1, y: -2 }}
                                    whileTap={{ scale: isSaving ? 1 : 0.95 }}
                                    onClick={() => handleAnswer(true)}
                                    className={`w-28 h-12 rounded-lg ${
                                      isSaving ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
                                    } text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm`}
                                    disabled={isSaving}
                                  >
                                    {isSaving ? (
                                      <span className="animate-pulse">...</span>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4" />
                                        <span className="font-semibold">Sí</span>
                                      </>
                                    )}
                                  </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white border-0">
                                  <p className="font-medium">Sí, estoy de acuerdo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <motion.button
                                    whileHover={{ scale: isSaving ? 1 : 1.1, y: -2 }}
                                    whileTap={{ scale: isSaving ? 1 : 0.95 }}
                                    onClick={() => handleAnswer(false)}
                                    className={`w-28 h-12 rounded-lg ${
                                      isSaving ? "bg-red-300" : "bg-red-500 hover:bg-red-600"
                                    } text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm`}
                                    disabled={isSaving}
                                  >
                                    {isSaving ? (
                                      <span className="animate-pulse">...</span>
                                    ) : (
                                      <>
                                        <X className="h-4 w-4" />
                                        <span className="font-semibold">No</span>
                                      </>
                                    )}
                                  </motion.button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-900 text-white border-0">
                                  <p className="font-medium">No, no estoy de acuerdo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        {currentQuestion > 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Button
                              onClick={handlePrevious}
                              className="mt-3 flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 text-sm"
                              disabled={isSaving}
                            >
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              {isSaving ? "Guardando..." : "Anterior"}
                            </Button>
                          </motion.div>
                        )}
                        
                        {/* Información adicional para llenar espacio */}
                        <div className="w-full text-left mt-4 space-y-3">
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg border border-purple-200 dark:border-gray-600">
                            <h4 className="text-sm font-semibold mb-2 text-purple-700 dark:text-purple-300 flex items-center">
                              <span className="mr-2 text-base">💡</span>
                              Consejo para responder
                            </h4>
                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                              Responde de manera honesta y espontánea. No hay respuestas correctas o incorrectas. 
                              Esta prueba está diseñada para descubrir tus preferencias naturales y fortalezas innatas.
                              <span className="block mt-1 font-medium text-purple-600 dark:text-purple-400">
                                🔒 Nadie más verá tus respuestas - son completamente privadas y confidenciales.
                              </span>
                            </p>
                          </div>
                          
                          {/* Información adicional sobre el test */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg border border-blue-200 dark:border-gray-600">
                            <h5 className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-300 flex items-center">
                              <span className="mr-2 text-base">📊</span>
                              Sobre el test CHASIDE
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              El test CHASIDE evalúa 7 dimensiones de personalidad: Creatividad, Habilidad, 
                              Adaptabilidad, Sociabilidad, Inteligencia, Determinación y Empatía. 
                              Cada respuesta contribuye a tu perfil único.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                          <Target className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Perfil de personalidad actual
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(scores).map(([type, score]) => (
                            <div key={type} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  {personalityIcons[type as PersonalityType]}
                                  <span className="ml-2">
                                    {type} - {personalityMeanings[type as PersonalityType]}
                                  </span>
                                </span>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {score}/{questions.filter((q) => q.type === type).length}
                                </span>
                              </div>
                              <div className="relative">
                                <Progress
                                  value={(score / questions.filter((q) => q.type === type).length) * 100}
                                  className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                                />
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(score / questions.filter((q) => q.type === type).length) * 100}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  style={{ borderRadius: '9999px' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
                ref={resultsRef}
              >
                <div className="bg-white dark:bg-gray-700 rounded-lg border border-border p-4">
                  <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-3">
                    Desglose de tu perfil
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(scores).map(([type, score]) => (
                        <div key={type} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                              {personalityIcons[type as PersonalityType]}
                              <span className="ml-2">
                                {type} - {personalityMeanings[type as PersonalityType]}
                              </span>
                            </span>
                            <span className="text-lg font-medium text-primary dark:text-primary-foreground">
                              {score}/{questions.filter((q) => q.type === type).length}
                            </span>
                          </div>
                          <div className="relative mb-2">
                            <Progress
                              value={(score / questions.filter((q) => q.type === type).length) * 100}
                              className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                            />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(score / questions.filter((q) => q.type === type).length) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              style={{ borderRadius: '9999px' }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {personalityDescriptions[type as PersonalityType]}
                          </p>
                        </div>
                        ))}
                    </div>
                </div>

                {dominantType && (
                  <div className="bg-primary text-primary-foreground rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-2">
                      Tu tipo de personalidad dominante
                    </h3>
                    <p className="text-base font-bold mb-1">
                      {dominantType} - {personalityMeanings[dominantType]}
                    </p>
                    <p className="text-sm">{personalityDescriptions[dominantType]}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </PageContainer>
  );
}

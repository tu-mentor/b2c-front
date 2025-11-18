import {
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
} from "chart.js";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  ChevronLeft,
  ClipboardList,
  Microscope,
  Palette,
  TrendingUp,
  Users,
  Wrench,
  GraduationCap,
  Target,
  BarChart3,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { getUserId, getUserInfo } from "../../../../services/auth-service";
import { hollandTestService } from "../../../../services/vocational-test/holland-service";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
import { LoadingCard } from "../../../shared/loading/loading-card";
import { Progress } from "../../../shared/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../shared/tooltip";
import { type Career, careers, type PersonalityType, questions } from "./holland-data";
import { PageContainer } from "../../../shared/page-container";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

const personalityIcons: Record<PersonalityType, React.ReactNode> = {
  Realista: <Wrench className="w-6 h-6" />,
  Investigador: <Microscope className="w-6 h-6" />,
  Artístico: <Palette className="w-6 h-6" />,
  Social: <Users className="w-6 h-6" />,
  Emprendedor: <TrendingUp className="w-6 h-6" />,
  Convencional: <ClipboardList className="w-6 h-6" />,
};

// Función para calcular el puntaje máximo por tipo de personalidad
const getMaxScorePerType = (): number => {
  // Ahora cada tipo tiene exactamente 10 preguntas (9 originales + 1 sutil)
  const questionsPerType = 10;
  const maxPointsPerQuestion = 5; // Puntaje máximo por pregunta
  return questionsPerType * maxPointsPerQuestion;
};

const AnimatedIcon = ({ type }: { type: PersonalityType; score: number }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 },
    });
  }, [controls]);

  return <motion.div animate={controls}>{personalityIcons[type]}</motion.div>;
};

const saveOrUpdateTestProgress = async (
  id: string | null,
  userId: string,
  currentQuestion: number,
  scores: Record<PersonalityType, number>
): Promise<string> => {
  const scoresData = {
    realistic: scores.Realista,
    investigative: scores.Investigador,
    artistic: scores.Artístico,
    social: scores.Social,
    enterprising: scores.Emprendedor,
    conventional: scores.Convencional,
  };

  if (id) {
    // Para update, no enviamos userId
    const updateData = {
      currentQuestion,
      scores: scoresData,
      careers: [],
    };
    await hollandTestService.updateHollandTest(id, updateData);
    return id;
  } else {
    // Para create, sí enviamos userId
    const createData = {
      userId,
      currentQuestion,
      scores: scoresData,
      careers: [],
    };
    const newHolland = await hollandTestService.createHollandTest(createData);
    return newHolland.id;
  }
};

const loadSavedProgress = async (
  userId: string
): Promise<{
  id: string;
  currentQuestion: number;
  scores: Record<PersonalityType, number>;
} | null> => {
  try {
    const savedData = await hollandTestService.getHollandTestByUserId(userId);
    if (savedData) {
      return {
        id: savedData._id,
        currentQuestion: savedData.currentQuestion,
        scores: {
          Realista: savedData.scores.realistic,
          Investigador: savedData.scores.investigative,
          Artístico: savedData.scores.artistic,
          Social: savedData.scores.social,
          Emprendedor: savedData.scores.enterprising,
          Convencional: savedData.scores.conventional,
        },
      };
    }
  } catch (error) {
    // Si hay un error diferente a 404, lo registramos pero no fallamos
    console.error("Error loading saved progress:", error);
  }
  return null;
};

function debounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result as ReturnType<T>);
        } catch (error) {
          console.error("Error in debounced function:", error);
          throw error;
        }
      }, wait);
    });
  };
}

const debouncedSaveOrUpdateTestProgress = debounce(saveOrUpdateTestProgress, 100);

export default function HollandVocationalTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<PersonalityType, number>>({
    Realista: 0,
    Investigador: 0,
    Artístico: 0,
    Social: 0,
    Emprendedor: 0,
    Convencional: 0,
  });
  const [dominantType, setDominantType] = useState<PersonalityType | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingResults, setIsSavingResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const breadcrumbItems = [
    {
      label: "Orientación Vocacional",
      href: "/vocational-guidance",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Prueba Holland",
      icon: <Target className="h-4 w-4" />,
    },
  ];

  // Función que actualiza los datos desde la API - con caché invalidation
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
        // Usamos una marca de tiempo para evitar la caché
        const timestamp = Date.now();
        const savedProgress = await loadSavedProgress(userInfo.user.id);

        if (savedProgress) {
          setId(savedProgress.id);
          setCurrentQuestion(savedProgress.currentQuestion);
          setScores(savedProgress.scores);

          if (savedProgress.currentQuestion >= questions.length - 1) {
            setShowResults(true);
          } else {
            setShowResults(false);
          }
        } else {
          // Si no hay progreso guardado, reiniciar todo
          setId(null);
          setCurrentQuestion(0);
          setScores({
            Realista: 0,
            Investigador: 0,
            Artístico: 0,
            Social: 0,
            Emprendedor: 0,
            Convencional: 0,
          });
          setShowResults(false);
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setInitialLoadComplete(true);
    }
  };

  // Este useEffect se ejecuta cada vez que el componente se monta
  useEffect(() => {
    refreshData();

    // Configurar el polling para actualizar los datos menos frecuentemente
    pollIntervalRef.current = setInterval(() => {
      refreshData();
    }, 300000); // Aumentar a 5 minutos para reducir llamadas a la API

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

  useEffect(() => {
    if (showResults) {
      // Eliminamos la llamada a getRecommendedCareers
    }
  }, [showResults, scores]);

  const handleAnswer = async (answer: number) => {
    if (isLoading || !userId || isSaving) return;

    setIsSaving(true);

    try {
      if (currentQuestion >= 0 && currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        const newScores = {
          ...scores,
          [question.type]: scores[question.type] + answer,
        };
        setScores(newScores);

        const newCurrentQuestion = currentQuestion + 1;
        setCurrentQuestion(newCurrentQuestion);

        if (newCurrentQuestion >= questions.length) {
          setIsSavingResults(true);
          try {
            const hollandId = await saveOrUpdateTestProgress(
              id,
              userId,
              newCurrentQuestion,
              newScores
            );
            setId(hollandId);

            setTimeout(() => {
              setShowResults(true);
              setIsSavingResults(false);
            }, 500);
          } catch (error) {
            console.error("Error saving progress:", error);
            setIsSavingResults(false);
          }
        } else {
          try {
            const hollandId = await debouncedSaveOrUpdateTestProgress(
              id,
              userId,
              newCurrentQuestion,
              newScores
            );
            setId(hollandId);
          } catch (error) {
            console.error("Error saving progress:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleAnswer:", error);
      setIsSavingResults(false);
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

        if (newCurrentQuestion === 0) {
          const resetScores = {
            Realista: 0,
            Investigador: 0,
            Artístico: 0,
            Social: 0,
            Emprendedor: 0,
            Convencional: 0,
          };
          setScores(resetScores);
        } else {
          const question = questions[newCurrentQuestion];
          const newScores = { ...scores };
          newScores[question.type] = Math.max(0, newScores[question.type] - 1);
          setScores(newScores);
        }

        try {
          await debouncedSaveOrUpdateTestProgress(id, userId, newCurrentQuestion, scores);
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      } catch (error) {
        console.error("Error in handlePrevious:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getPersonalityDescription = (type: PersonalityType) => {
    const descriptions: Record<PersonalityType, string> = {
      Realista:
        "Práctico y orientado a las manualidades. Te gusta trabajar con herramientas, máquinas y estar al aire libre.",
      Investigador:
        "Analítico y curioso. Disfrutas resolviendo problemas complejos y realizando investigaciones.",
      Artístico:
        "Creativo y expresivo. Te gusta trabajar en entornos que permiten la autoexpresión y la originalidad.",
      Social: "Servicial y cooperativo. Disfrutas trabajando con personas y ayudando a otros.",
      Emprendedor:
        "Persuasivo y orientado a los objetivos. Te gusta liderar, vender y convencer a otros.",
      Convencional:
        "Organizado y detallista. Prefieres trabajar con datos, seguir procedimientos claros y mantener el orden.",
    };
    return descriptions[type];
  };

  const getExpandedPersonalityDescription = (type: PersonalityType) => {
    const descriptions: Record<
      PersonalityType,
      { strengths: string[]; weaknesses: string[]; characteristics: string[] }
    > = {
      Realista: {
        strengths: ["Habilidades mecánicas", "Coordinación física", "Enfoque práctico"],
        weaknesses: [
          "Puede tener dificultades con la comunicación interpersonal",
          "Puede ser inflexible",
        ],
        characteristics: [
          "Prefiere trabajar con objetos, máquinas o herramientas",
          "Valora las soluciones prácticas",
          "Disfruta del trabajo al aire libre",
        ],
      },
      Investigador: {
        strengths: [
          "Pensamiento analítico",
          "Habilidades de investigación",
          "Resolución de problemas complejos",
        ],
        weaknesses: ["Puede tener dificultades con el liderazgo", "Puede ser demasiado abstracto"],
        characteristics: [
          "Disfruta resolviendo problemas complejos",
          "Valora el conocimiento y la comprensión",
          "Prefiere trabajar de forma independiente",
        ],
      },
      Artístico: {
        strengths: ["Creatividad", "Expresión personal", "Originalidad"],
        weaknesses: [
          "Puede tener dificultades con tareas estructuradas",
          "Puede ser emocionalmente sensible",
        ],
        characteristics: [
          "Disfruta de la autoexpresión creativa",
          "Valora la estética y la innovación",
          "Prefiere ambientes de trabajo no estructurados",
        ],
      },
      Social: {
        strengths: ["Habilidades interpersonales", "Empatía", "Capacidad de enseñanza"],
        weaknesses: [
          "Puede tener dificultades con tareas técnicas",
          "Puede ser demasiado dependiente de otros",
        ],
        characteristics: [
          "Disfruta trabajando con personas",
          "Valora el servicio a los demás",
          "Prefiere resolver problemas a través de la discusión",
        ],
      },
      Emprendedor: {
        strengths: ["Liderazgo", "Persuasión", "Toma de decisiones"],
        weaknesses: [
          "Puede ser demasiado competitivo",
          "Puede tener dificultades con tareas científicas",
        ],
        characteristics: [
          "Disfruta persuadiendo e influyendo en otros",
          "Valora el éxito económico",
          "Prefiere roles de liderazgo",
        ],
      },
      Convencional: {
        strengths: ["Organización", "Atención al detalle", "Confiabilidad"],
        weaknesses: ["Puede ser inflexible", "Puede tener dificultades con la ambigüedad"],
        characteristics: [
          "Disfruta trabajando con datos y detalles",
          "Valora la precisión y la estructura",
          "Prefiere seguir procedimientos establecidos",
        ],
      },
    };
    return descriptions[type];
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Cargando tu test de Holland"
        description="Estamos recuperando tus datos desde la base de datos..."
        breadcrumbItems={breadcrumbItems}
      >
        <LoadingCard />
      </PageContainer>
    );
  }

  if (isSavingResults) {
    return (
      <PageContainer
        title="Procesando tus resultados"
        description="Estamos analizando tus respuestas y generando tu perfil RIASEC..."
        breadcrumbItems={breadcrumbItems}
      >
        <LoadingCard />
      </PageContainer>
    );
  }

  if (!initialLoadComplete) {
    return (
      <PageContainer
        title="Cargando tu test de Holland"
        description="Estamos recuperando tus datos desde la base de datos..."
        breadcrumbItems={breadcrumbItems}
      >
        <LoadingCard />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={showResults ? "Resultados de tu Test Vocacional de Holland" : "Descubre tu perfil profesional ideal"}
      description={!showResults ? "Esta herramienta te ayudará a identificar tus fortalezas y áreas de interés para encontrar la carrera perfecta para ti." : undefined}
      breadcrumbItems={breadcrumbItems}
      icon={<Target className="h-6 w-6" />}
    >
      <div className="w-full mx-auto text-center container max-w-7xl space-y-4">
          {!showResults && (
            <p className="mb-6 text-base md:text-lg text-gray-600 dark:text-gray-300">
   
            </p>
          )}
          <AnimatePresence mode="wait">
            {showResults ? (
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
                      {Object.entries(scores)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, score]) => (
                          <div key={type} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <AnimatedIcon type={type as PersonalityType} score={score} />
                                <span className="ml-2">{type}</span>
                              </span>
                              <span className="text-base font-medium text-primary dark:text-primary-foreground">
                                {score}/{getMaxScorePerType()}
                              </span>
                            </div>
                            <div className="relative mb-2">
                              <Progress
                                value={(score / getMaxScorePerType()) * 100}
                                className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(score / getMaxScorePerType()) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ borderRadius: '9999px' }}
                              />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {getPersonalityDescription(type as PersonalityType)}
                            </p>
                          </div>
                        ))}
                    </div>
                </div>

                <div className="bg-primary text-primary-foreground rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2">
                    Tu tipo de personalidad dominante
                  </h3>
                  <p className="text-base font-bold mb-1">{dominantType}</p>
                  <p className="text-sm">
                    {dominantType && getPersonalityDescription(dominantType)}
                  </p>
                </div>

                {dominantType && (
                  <div className="bg-white dark:bg-gray-700 rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-3">
                      Perfil detallado: {dominantType}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-left">
                          <h4 className="font-semibold text-base mb-2 text-primary dark:text-primary-foreground">
                            Fortalezas:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {getExpandedPersonalityDescription(dominantType).strengths.map(
                              (strength, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">
                                  {strength}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-left">
                          <h4 className="font-semibold text-base mb-2 text-primary dark:text-primary-foreground">
                            Debilidades:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {getExpandedPersonalityDescription(dominantType).weaknesses.map(
                              (weakness, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">
                                  {weakness}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-left">
                          <h4 className="font-semibold text-base mb-2 text-primary dark:text-primary-foreground">
                            Características clave:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {getExpandedPersonalityDescription(dominantType).characteristics.map(
                              (characteristic, index) => (
                                <li key={index} className="text-gray-700 dark:text-gray-300">
                                  {characteristic}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                </div>
                )}
              </motion.div>
            ) : (
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
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="w-full text-left">
                          <h3 className="text-base font-bold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                            <span className="mr-2 text-lg">🤔</span>
                            ¿Qué tan de acuerdo estás con la siguiente afirmación?
                          </h3>
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-blue-200 dark:border-gray-600">
                            <div className="flex items-center justify-center mb-3">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                                {personalityIcons[questions[currentQuestion]?.type as PersonalityType]}
                                <span className="ml-2">
                                  {questions[currentQuestion]?.type}
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
                          <div className="flex flex-wrap justify-start gap-2 mt-3">
                            {[
                              { value: 1, emoji: "😕", description: "No me gusta nada", shortDesc: "No me gusta", color: "bg-red-50 border-red-200", hoverColor: "hover:bg-red-100 hover:border-red-300", textColor: "text-red-600" },
                              { value: 2, emoji: "😐", description: "No me gusta mucho", shortDesc: "No me gusta mucho", color: "bg-orange-50 border-orange-200", hoverColor: "hover:bg-orange-100 hover:border-orange-300", textColor: "text-orange-600" },
                              { value: 3, emoji: "🤷", description: "Me da igual", shortDesc: "Me da igual", color: "bg-amber-50 border-amber-200", hoverColor: "hover:bg-amber-100 hover:border-amber-300", textColor: "text-amber-600" },
                              { value: 4, emoji: "🙂", description: "Me gusta", shortDesc: "Me gusta", color: "bg-blue-50 border-blue-200", hoverColor: "hover:bg-blue-100 hover:border-blue-300", textColor: "text-blue-600" },
                              { value: 5, emoji: "😃", description: "Me encanta", shortDesc: "Me encanta", color: "bg-emerald-50 border-emerald-200", hoverColor: "hover:bg-emerald-100 hover:border-emerald-300", textColor: "text-emerald-600" },
                            ].map(({ value, emoji, description, shortDesc, color, hoverColor, textColor }) => (
                              <TooltipProvider key={value}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center space-y-1 w-[calc(20%-0.4rem)] min-w-[70px] max-w-[90px]">
                                      <motion.button
                                        whileHover={{ scale: isSaving ? 1 : 1.1, y: -2 }}
                                        whileTap={{ scale: isSaving ? 1 : 0.95 }}
                                        onClick={() => handleAnswer(value)}
                                        className={`w-12 h-12 rounded-lg border-2 shadow-sm ${
                                          isSaving 
                                            ? "border-gray-300 bg-gray-50" 
                                            : `${color} ${hoverColor} hover:shadow-md transform transition-all duration-300 ease-out`
                                        } flex items-center justify-center text-xl backdrop-blur-sm`}
                                        disabled={isSaving}
                                      >
                                        {emoji}
                                      </motion.button>
                                      <span className={`text-xs font-semibold text-center break-words ${textColor} leading-tight`}>
                                        {shortDesc}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-900 text-white border-0">
                                    <p className="font-medium">
                                      {emoji} {description}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>
                          {isSaving && (
                            <div className="text-left text-primary font-medium mb-2 mt-2 text-sm">
                              <span className="animate-pulse">
                                {currentQuestion === questions.length - 1
                                  ? "Procesando tus resultados finales..."
                                  : "Guardando respuesta..."}
                              </span>
                            </div>
                          )}
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
                              {isSaving ? (
                                <span className="animate-pulse">Guardando...</span>
                              ) : (
                                "Anterior"
                              )}
                            </Button>
                          </motion.div>
                        )}
                        
                        {/* Información adicional para llenar espacio */}
                        <div className="w-full text-left mt-4">
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
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                          <BarChart3 className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Resultados preliminares
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(scores).map(([type, score]) => (
                            <div key={type} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <AnimatedIcon type={type as PersonalityType} score={score} />
                                  <span className="ml-2">{type}</span>
                                </span>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {score}/{getMaxScorePerType()}
                                </span>
                              </div>
                              <div className="relative">
                                <Progress
                                  value={(score / getMaxScorePerType()) * 100}
                                  className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                                />
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(score / getMaxScorePerType()) * 100}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  style={{ borderRadius: '9999px' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Información adicional sobre el test */}
                        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                          <h5 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200 flex items-center">
                            <span className="mr-2 text-base">📊</span>
                            Sobre el test de Holland
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            El test de Holland evalúa 6 tipos de personalidad: Realista, Investigador, Artístico, 
                            Social, Emprendedor y Convencional. Cada tipo representa diferentes intereses y 
                            preferencias profesionales que te ayudarán a encontrar tu vocación ideal.
                          </p>
                        </div>
                      </div>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </PageContainer>
  );
}

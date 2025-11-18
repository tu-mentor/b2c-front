"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Award, Book, Briefcase, Rocket, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { kitProgressService } from "../../../services/kit-progress-service";
import { Alert, AlertDescription, AlertTitle } from "../../shared/alert";
import { Button } from "../../shared/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../shared/card";
import { Questions1 } from "./steps/questions-1";
import { Questions2 } from "./steps/questions-2";
import { Questions3 } from "./steps/questions-3";
import FirstStep from "./steps/step_1";
import SecondStep from "./steps/step_2";
import ThirdStep from "./steps/step_3";
import FourthStep from "./steps/step_4";
import FifthStep from "./steps/step_5";
import SixthStep from "./steps/step_6";

const steps = [
  {
    icon: Book,
    text: "Adquiere Habilidades Duras",
    component: FirstStep,
    description: "Desarrolla competencias clave",
  },
  {
    icon: Rocket,
    text: "Carrera Universitaria",
    component: SecondStep,
    description: "Elige tu formación profesional",
  },
  {
    icon: Star,
    text: "Marca Personal",
    component: ThirdStep,
    description: "Construye tu imagen profesional",
  },
  {
    icon: Award,
    text: "Primer Empleo",
    component: FourthStep,
    description: "Inicia tu carrera laboral",
  },
  {
    icon: Briefcase,
    text: "Emprendimiento Juvenil",
    component: FifthStep,
    description: "Crea tu propio negocio",
  },
  {
    icon: TrendingUp,
    text: "Educación Financiera",
    component: SixthStep,
    description: "Aprende a manejar tu dinero",
  },
];

// Función para log que solo actúa en desarrollo
const logDev = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(message, ...args);
  }
};

export default function ProjectKit({
  userId,
  forceRefresh,
  onClose,
}: {
  userId: string;
  forceRefresh?: number; // Número que cambia para forzar actualización
  onClose?: () => void; // Función para cerrar el popup
}) {
  // Estado para controlar si los datos iniciales ya se cargaron
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [questionResults1, setQuestionResults1] = useState<Record<string, Record<string, string>>>({});
  const [questionResults2, setQuestionResults2] = useState<Record<string, Record<string, string>>>({});
  const [questionResults3, setQuestionResults3] = useState<Record<string, Record<string, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    questions1Completed: false,
    questions2Completed: false,
    questions3Completed: false,
  });
  const [showingQuestionnaire, setShowingQuestionnaire] = useState<number | null>(null);

  const validateProgress = async () => {
    try {
      const fetchedProgress = await kitProgressService.getProgress(userId);
      // logDev en vez de console.log
      logDev("Progreso actualizado desde API (validateProgress):", fetchedProgress);

      // Actualizar el estado de progreso
      setProgress({
        questions1Completed: fetchedProgress.questions1Completed,
        questions2Completed: fetchedProgress.questions2Completed,
        questions3Completed: fetchedProgress.questions3Completed,
      });

      // Actualizar el paso actual solo si no hay un cuestionario mostrándose
      if (showingQuestionnaire === null) {
        setCurrentStep(fetchedProgress.currentStep);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      setError("Hubo un error al cargar tu progreso. Por favor, inténtalo de nuevo.");
    }
  };

  // Efecto de inicialización que se ejecuta una sola vez al montar el componente
  useEffect(() => {
    logDev("ProjectKit - Montaje inicial con forceRefresh:", forceRefresh);

    // Función inmediatamente invocada para permitir async/await
    (async () => {
      try {
        // Resetear todos los estados a sus valores iniciales
        setCurrentStep(null);
        setShowingQuestionnaire(null);
        setError(null);
        setProgress({
          questions1Completed: false,
          questions2Completed: false,
          questions3Completed: false,
        });

        setIsLoading(true);

        // Forzar a obtener datos frescos añadiendo un timestamp a la petición
        const timestamp = new Date().getTime();
        logDev("Obteniendo datos frescos desde API con timestamp:", timestamp);

        const fetchedProgress = await kitProgressService.getProgress(`${userId}?t=${timestamp}`);
        logDev("Progreso cargado desde API (montaje inicial):", fetchedProgress);

        // Actualizar el estado de progreso
        setProgress({
          questions1Completed: fetchedProgress.questions1Completed,
          questions2Completed: fetchedProgress.questions2Completed,
          questions3Completed: fetchedProgress.questions3Completed,
        });

        // Actualizar el paso actual
        setCurrentStep(fetchedProgress.currentStep);
      } catch (error) {
        console.error("Error al cargar el progreso:", error);
        setError("Hubo un error al cargar tu progreso. Por favor, inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    })();

    // Verificar que los componentes de los pasos existen
    logDev("Verificando componentes de pasos:");
    steps.forEach((step, index) => {
      logDev(`Paso ${index + 1} - ${step.text}:`, !!step.component ? "✓" : "✗");
    });

    // Limpieza al desmontar
    return () => {
      logDev("ProjectKit - Desmontando componente");
      // Asegurar que se limpien todos los estados al desmontar
      setCurrentStep(null);
      setShowingQuestionnaire(null);
      setProgress({
        questions1Completed: false,
        questions2Completed: false,
        questions3Completed: false,
      });
    };
  }, [userId, forceRefresh]); // Dependencias: userId y forceRefresh

  const startKit = async () => {
    try {
      // Forzar a obtener datos frescos añadiendo un timestamp a la petición
      const timestamp = new Date().getTime();

      // Actualizar en el backend preservando el estado de cuestionarios
      await kitProgressService.updateProgress(`${userId}?t=${timestamp}`, {
        currentStep: 0,
        // Preservar el estado de los cuestionarios o establecerlos a true si no existen
        questions1Completed: progress.questions1Completed || true,
        questions2Completed: progress.questions2Completed || true,
        questions3Completed: progress.questions3Completed || true,
      });

      // Actualizar el estado local
      setCurrentStep(0);
      // Resetear el estado del cuestionario
      setShowingQuestionnaire(null);

      // Asegurar que los cuestionarios se mantengan como completados
      setProgress((prev) => ({
        ...prev,
        questions1Completed: true,
        questions2Completed: true,
        questions3Completed: true,
      }));

      logDev("Iniciando kit manteniendo cuestionarios completados");
    } catch (error) {
      console.error("Error starting kit:", error);
      setError("Hubo un error al iniciar. Por favor, inténtalo de nuevo.");
    }
  };

  // Si está cargando, mostrar indicador de carga
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">Cargando progreso...</p>
        </div>
      </div>
    );
  }

  // Función auxiliar para verificar si se puede mostrar un cuestionario
  const setQuestionnaireIfNotCompleted = (questionnaireNumber: number) => {
    if (
      (questionnaireNumber === 1 && !progress.questions1Completed) ||
      (questionnaireNumber === 2 && !progress.questions2Completed) ||
      (questionnaireNumber === 3 && !progress.questions3Completed)
    ) {
      setShowingQuestionnaire(questionnaireNumber);
      return true;
    }
    return false;
  };

  const nextStep = async () => {
    if (currentStep === null) return;

    try {
      // Verificar si hay un cuestionario que debe completarse antes de avanzar
      // Solo mostrar cuestionarios si no están completados
      if (currentStep === 0 && !progress.questions1Completed) {
        // Mostrar el cuestionario 1 en lugar de avanzar
        if (setQuestionnaireIfNotCompleted(1)) {
          logDev("Mostrando cuestionario 1 antes de avanzar al paso 2");
          return;
        }
      }

      if (currentStep === 1 && !progress.questions2Completed) {
        // Mostrar el cuestionario 2 en lugar de avanzar
        if (setQuestionnaireIfNotCompleted(2)) {
          logDev("Mostrando cuestionario 2 antes de avanzar al paso 3");
          return;
        }
      }

      if (currentStep === 4 && !progress.questions3Completed) {
        // Mostrar el cuestionario 3 en lugar de avanzar
        if (setQuestionnaireIfNotCompleted(3)) {
          logDev("Mostrando cuestionario 3 antes de avanzar al paso 5");
          return;
        }
      }

      // Calcular el siguiente paso adecuado
      let newStep = currentStep + 1;

      // Avanzar directamente a los pasos correctos si los cuestionarios ya están completados
      if (currentStep === 0 && progress.questions1Completed) {
        newStep = 1; // Avanzar al paso 2 (Carrera Universitaria)
      } else if (currentStep === 1 && progress.questions2Completed) {
        newStep = 2; // Avanzar al paso 3 (Marca Personal)
      } else if (currentStep === 4 && progress.questions3Completed) {
        newStep = 5; // Avanzar al paso 5 (Emprendimiento Juvenil)
      }

      // Verificar que no excedamos el último paso
      if (newStep >= steps.length) {
        newStep = steps.length - 1;
      }

      // Actualizar en el backend
      await kitProgressService.updateProgress(userId, {
        currentStep: newStep,
        // Preservar el estado de los cuestionarios
        questions1Completed: progress.questions1Completed,
        questions2Completed: progress.questions2Completed,
        questions3Completed: progress.questions3Completed,
      });

      // Luego actualizar el estado local
      setCurrentStep(newStep);

      // No necesitamos refrescar desde el backend, confiamos en el estado local
      logDev(`Avanzando al paso ${newStep + 1} preservando estado de cuestionarios`);
    } catch (error) {
      console.error("Error updating progress:", error);
      setError("Hubo un error al guardar tu progreso. Por favor, inténtalo de nuevo.");
    }
  };

  const prevStep = async () => {
    if (currentStep === null || currentStep <= 0) return;

    try {
      const newStep = currentStep - 1;

      // Resetear cualquier cuestionario que se esté mostrando
      setShowingQuestionnaire(null);

      // Actualizar en el backend
      await kitProgressService.updateProgress(userId, {
        currentStep: newStep,
        // Preservar el estado de los cuestionarios
        questions1Completed: progress.questions1Completed,
        questions2Completed: progress.questions2Completed,
        questions3Completed: progress.questions3Completed,
      });

      // Luego actualizar el estado local
      setCurrentStep(newStep);

      // No necesitamos refrescar desde el backend, confiamos en el estado local
      logDev(`Retrocediendo al paso ${newStep + 1} preservando estado de cuestionarios`);
    } catch (error) {
      console.error("Error updating progress:", error);
      setError("Hubo un error al guardar tu progreso. Por favor, inténtalo de nuevo.");
    }
  };

  const handleQuestions1Complete = async (results: Record<string, Record<string, string>>) => {
    setQuestionResults1(results);
    const userAnswers = results[userId] || {};
    const allQuestionsAnswered = Object.keys(userAnswers).length === 3;
    if (allQuestionsAnswered) {
      try {
        // Actualizar en el backend que se completó el cuestionario Y avanzar al paso 2
        await kitProgressService.updateProgress(userId, {
          questions1Completed: true,
          currentStep: 1, // Avanzar al paso 2 (Carrera Universitaria)
        });

        // Actualizar estado local
        setCurrentStep(1);
        setProgress((prev) => ({ ...prev, questions1Completed: true }));
        setShowingQuestionnaire(null); // Resetear el estado del cuestionario
        setError(null);

        logDev("Cuestionario 1 completado, avanzando al paso 2");
      } catch (error) {
        console.error("Error updating child kit:", error);
        setError("Hubo un error al guardar las respuestas. Por favor, inténtalo de nuevo.");
      }
    } else {
      setError("Por favor, contesta todas las preguntas para continuar.");
    }
  };

  const handleQuestions2Complete = async (results: Record<string, Record<string, string>>) => {
    setQuestionResults2(results);
    const userAnswers = results[userId] || {};
    const allQuestionsAnswered = Object.keys(userAnswers).length === 1;
    if (allQuestionsAnswered) {
      try {
        // Actualizar en el backend que se completó el cuestionario Y avanzar al paso 3
        await kitProgressService.updateProgress(userId, {
          questions2Completed: true,
          currentStep: 2, // Avanzar al paso 3 (Marca Personal)
        });

        // Actualizar estado local
        setCurrentStep(2);
        setProgress((prev) => ({ ...prev, questions2Completed: true }));
        setShowingQuestionnaire(null); // Resetear el estado del cuestionario
        setError(null);

        logDev("Cuestionario 2 completado, avanzando al paso 3");
      } catch (error) {
        console.error("Error updating child kit:", error);
        setError("Hubo un error al guardar las respuestas. Por favor, inténtalo de nuevo.");
      }
    } else {
      setError("Por favor, contesta todas las preguntas para continuar.");
    }
  };

  const handleQuestions3Complete = async (results: Record<string, Record<string, string>>) => {
    setQuestionResults3(results);
    const userAnswers = results[userId] || {};
    const allQuestionsAnswered = Object.keys(userAnswers).length === 3;
    if (allQuestionsAnswered) {
      try {
        // Actualizar en el backend que se completó el cuestionario Y avanzar al paso 5
        await kitProgressService.updateProgress(userId, {
          questions3Completed: true,
          currentStep: 5, // Avanzar al paso 5 (Emprendimiento Juvenil)
        });

        // Actualizar estado local
        setCurrentStep(5);
        setProgress((prev) => ({ ...prev, questions3Completed: true }));
        setShowingQuestionnaire(null); // Resetear el estado del cuestionario
        setError(null);

        logDev("Cuestionario 3 completado, avanzando al paso 5");
      } catch (error) {
        console.error("Error updating child kit:", error);
        setError("Hubo un error al guardar las respuestas. Por favor, inténtalo de nuevo.");
      }
    } else {
      setError("Por favor, contesta todas las preguntas para continuar.");
    }
  };

  if (currentStep !== null) {
    // Renderizar cuestionarios basados en el estado showingQuestionnaire
    // pero solo si no están completados
    if (showingQuestionnaire === 1 && !progress.questions1Completed) {
      return (
        <div className="w-full bg-background text-foreground flex flex-col items-center p-2 sm:p-3">
          <h2 className="text-2xl font-bold mb-4 text-center">Evaluación de Intereses</h2>
          <p className="text-lg mb-6 text-center max-w-3xl">
            Para personalizar mejor tu experiencia en el paso de Carrera Universitaria, necesitamos conocer tus
            intereses y preferencias. Por favor completa este breve cuestionario.
          </p>
          <Questions1
            userId={userId}
            onComplete={handleQuestions1Complete}
            initialAnswers={questionResults1}
          />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={() => setShowingQuestionnaire(null)} variant="outline" className="mt-4">
            Volver al paso actual
          </Button>
        </div>
      );
    } else if (showingQuestionnaire === 2 && !progress.questions2Completed) {
      return (
        <div className="w-full bg-background text-foreground flex flex-col items-center p-2 sm:p-3">
          <h2 className="text-2xl font-bold mb-4 text-center">Evaluación de Aptitudes</h2>
          <p className="text-lg mb-6 text-center max-w-3xl">
            Antes de avanzar a la construcción de tu Marca Personal, es importante identificar tus fortalezas y
            habilidades. Este cuestionario nos ayudará a orientarte mejor.
          </p>
          <Questions2
            userId={userId}
            onComplete={handleQuestions2Complete}
            initialAnswers={questionResults2}
          />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={() => setShowingQuestionnaire(null)} variant="outline" className="mt-4">
            Volver al paso actual
          </Button>
        </div>
      );
    } else if (showingQuestionnaire === 3 && !progress.questions3Completed) {
      return (
        <div className="w-full bg-background text-foreground flex flex-col items-center p-2 sm:p-3">
          <h2 className="text-2xl font-bold mb-4 text-center">Evaluación de Emprendimiento</h2>
          <p className="text-lg mb-6 text-center max-w-3xl">
            Antes de explorar el mundo del Emprendimiento Juvenil, queremos entender tu perfil emprendedor y
            motivaciones. Este cuestionario nos permitirá ofrecerte recomendaciones más relevantes.
          </p>
          <Questions3
            userId={userId}
            onComplete={handleQuestions3Complete}
            initialAnswers={questionResults3}
          />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={() => setShowingQuestionnaire(null)} variant="outline" className="mt-4">
            Volver al paso actual
          </Button>
        </div>
      );
    }
    // Si hay un intento de mostrar un cuestionario ya completado, resetear el estado
    else if (showingQuestionnaire !== null) {
      // Resetear el estado si se intenta mostrar un cuestionario ya completado
      setShowingQuestionnaire(null);
    }
    // Si no se está mostrando ningún cuestionario, mostrar el componente del paso actual
    else {
      const StepComponent = steps[currentStep].component;
      return (
        <div className="w-full bg-background text-foreground flex flex-col items-center p-2 sm:p-3">
          {StepComponent && <StepComponent />}
          <Alert variant="destructive" className="bg-card text-card-foreground w-full max-w-4xl mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription className="text-gray-500">
              Este material es un marco de referencia basado en nuestra experiencia, y tú decides si adoptarlo o no. Si
              deseas un enfoque personalizado, te invitamos a explorar nuestro Plan Premium IA.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex flex-col gap-4 items-center w-full max-w-lg">
            <div className="flex gap-4 justify-between w-full">
              {currentStep > 0 && (
                <Button onClick={prevStep} variant="outline">
                  Anterior
                </Button>
              )}
              {currentStep === 0 && <div></div>}
              {currentStep < steps.length - 1 ? (
                <Button onClick={nextStep}>
                  {(currentStep === 0 && !progress.questions1Completed) ||
                  (currentStep === 1 && !progress.questions2Completed) ||
                  (currentStep === 4 && !progress.questions3Completed)
                    ? "Continuar al cuestionario"
                    : "Siguiente paso"}
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={async () => {
                      try {
                        // Actualizar en el backend asegurando que todos los cuestionarios permanezcan completados
                        await kitProgressService.updateProgress(userId, {
                          currentStep: 0,
                          // Forzar que todos los cuestionarios se mantengan completados
                          questions1Completed: true,
                          questions2Completed: true,
                          questions3Completed: true,
                        });

                        // Actualizar el estado local
                        setCurrentStep(0);
                        setShowingQuestionnaire(null);

                        // Forzar el estado de cuestionarios a completado en el estado local
                        // sin depender del backend
                        setProgress({
                          questions1Completed: true,
                          questions2Completed: true,
                          questions3Completed: true,
                        });

                        logDev("Reiniciando kit al paso 1 manteniendo cuestionarios completados");
                      } catch (error) {
                        console.error("Error resetting progress:", error);
                        setError("Hubo un error al reiniciar. Por favor, inténtalo de nuevo.");
                      }
                    }}
                  >
                    Volver a iniciar
                  </Button>
                  {onClose && (
                    <Button variant="outline" onClick={onClose}>
                      Volver a los resultados
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="w-full bg-background text-foreground flex flex-col items-center justify-between p-2 sm:p-3">
      <div className="flex flex-col items-center flex-grow w-full max-w-5xl mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Kit Proyecto de Vida Juvenil
        </motion.h1>
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl mb-6 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Diseña Tu Futuro en 6 Pasos
        </motion.h2>
        <Card className="w-full mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Sobre este Kit</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              <p className="mb-4">
                Tu-Mentor.com ofrece este material gratuitamente como un valor agregado tras completar el módulo de
                exploración vocacional. Se trata de un marco de referencia no personalizado que puedes implementar
                parcial o totalmente, según tus necesidades.
              </p>
              <p>
                Si buscas un enfoque personalizado, nuestro Plan Premium IA te brinda estrategias a la medida, diseñadas
                por mentores expertos mediante una entrevista 1 a 1, combinando experiencia humana con el poder
                analítico de la Inteligencia Artificial para garantizar un plan único y efectivo.
              </p>
            </CardDescription>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 w-full">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-card text-card-foreground p-3 rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-muted h-[100px]"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onHoverStart={() => setHoveredStep(index)}
              onHoverEnd={() => setHoveredStep(null)}
              onClick={async () => {
                // Verificar que los cuestionarios necesarios estén completados
                // o saltar esta verificación para los pasos que no requieren cuestionarios previos
                if (index < 1 || progress.questions1Completed) {
                  if (index < 2 || progress.questions2Completed) {
                    if (index < 5 || progress.questions3Completed) {
                      try {
                        // Actualizar en el backend
                        await kitProgressService.updateProgress(userId, {
                          currentStep: index,
                          // Preservar el estado de cuestionarios completados
                          questions1Completed: progress.questions1Completed,
                          questions2Completed: progress.questions2Completed,
                          questions3Completed: progress.questions3Completed,
                        });
                        // Actualizar el estado local
                        setCurrentStep(index);
                        setShowingQuestionnaire(null); // Asegurar que no se muestren cuestionarios

                        // No necesitamos volver a consultar el backend, mantenemos el estado actual
                        // para evitar que los cuestionarios cambien su estado
                        logDev(`Navegando directamente al paso ${index + 1} preservando cuestionarios`);
                      } catch (error) {
                        console.error("Error navigating to step:", error);
                        setError("Hubo un error al navegar al paso. Por favor, inténtalo de nuevo.");
                      }
                    } else {
                      setError("Debes completar el cuestionario 3 antes de acceder a este paso.");
                    }
                  } else {
                    setError("Debes completar el cuestionario 2 antes de acceder a este paso.");
                  }
                } else {
                  setError("Debes completar el cuestionario 1 antes de acceder a este paso.");
                }
              }}
            >
              <step.icon size={24} className="mb-2 text-primary" />
              <p className="text-center font-semibold text-lg">{step.text}</p>
              <AnimatePresence>
                {hoveredStep === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-1 text-[10px] text-center overflow-hidden text-muted-foreground"
                  >
                    {step.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto"
          onClick={startKit}
        >
          Iniciar "Kit Proyecto de Vida" <ArrowRight className="ml-2" />
        </Button>

        {error && (
          <Alert variant="destructive" className="mt-4 w-full max-w-lg">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

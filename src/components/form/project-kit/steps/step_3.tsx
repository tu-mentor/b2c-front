import { useState } from "react";
import { motion } from "framer-motion";
import {
  Fingerprint,
  Target,
  Users,
  RefreshCwIcon as Refresh,
  Edit,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/card";
import { Progress } from "../../../shared/progress";
import { Button } from "../../../shared/button";
import React from "react";

const steps = [
  {
    icon: Fingerprint,
    title: "Diagnóstico",
    description:
      "Identifica tu identidad y objetivos: Define tus valores, habilidades y metas. Identifica qué te hace único y cómo quieres ser percibido.",
  },
  {
    icon: Target,
    title: "Estrategia",
    description:
      "Define tu mensaje y público objetivo: Crea un mensaje claro sobre quién eres y a quién te diriges (empleadores, clientes o socios).",
  },
  {
    icon: Users,
    title: "Construcción",
    description:
      "Desarrolla tu presencia digital y física: Establece tu presencia digital (LinkedIn, portafolio web) y optimiza tus perfiles con fotos y descripciones profesionales",
  },
  {
    icon: Edit,
    title: "Acción",
    description:
      "Genera contenido y participa en networking: Publica contenido relevante, asiste a eventos de networking y participa en comunidades profesionales.",
  },
  {
    icon: RefreshCw,
    title: "Seguimiento",
    description:
      "Evalúa resultados y ajusta constantemente: Evalúa tus resultados, ajusta tu estrategia y solicita retroalimentación para mejorar continuamente.",
  },
] as const;

export default function ThirdStep() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start p-2 sm:p-3 ">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold  mb-6 sm:mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tercer Paso: Marca Personal
      </motion.h1>
      <Card className="w-full max-w-4xl bg-slate-100">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">¿Por Qué?</CardTitle>
          <CardDescription className="text-sm sm:text-base text-center">
            El <strong>70%</strong> de los empleadores revisa redes sociales y el{" "}
            <strong>54%</strong> descarta candidatos sin presencia online (CareerBuilder). Además,
            los perfiles con marca personal en LinkedIn reciben <strong>21</strong> veces más
            visitas y <strong>36</strong> veces más mensajes, lo que incrementa las oportunidades
            laborales. <br />
            <br />
            <strong>Importancia de la marca personal para los jóvenes</strong>
            <br />
            <ul className="text-left">
              <li>
                <strong>Diferenciación: </strong>Destacan frente a otros candidatos en un mercado
                laboral competitivo.
              </li>
              <li>
                <strong>Credibilidad: </strong>Reflejan profesionalismo, confianza y coherencia en
                su perfil.
              </li>
              <li>
                <strong>Oportunidades:</strong> Facilita el networking y la conexión con empleadores
                o socios potenciales.
              </li>
              <li>
                <strong>Adaptabilidad: </strong>Refleja su capacidad de evolución y alineación con
                las tendencias del mercado.
              </li>
              <li>
                <strong>Control de su narrativa:</strong> Muestran quiénes son y qué valor aportan.
              </li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 sm:mb-8">
            <Progress value={(currentStep + 1) * 20} className="w-full" />
          </div>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            {React.createElement(steps[currentStep].icon, {
              className: "w-12 h-12 sm:w-16 sm:h-16 mb-4 text-blue-600",
            })}
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{steps[currentStep].title}</h3>
            <p className="text-sm sm:text-base">{steps[currentStep].description}</p>
          </motion.div>
          <div className="mt-8 flex justify-center">
            <Button onClick={nextStep} className="flex items-center text-sm sm:text-base">
              {currentStep === steps.length - 1 ? "Volver a iniciar" : "Siguiente paso"}{" "}
              <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

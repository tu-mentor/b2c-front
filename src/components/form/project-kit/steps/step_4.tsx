"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Book, Briefcase, Users, Search, MessageCircle, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/card";
import { Progress } from "../../../shared/progress";
import { Button } from "../../../shared/button";
import React from "react";

const steps = [
  {
    icon: FileText,
    title: "Desarrolla tu perfil profesional",
    description:
      "Crea un CV atractivo con tus pasantías, voluntariados y portafolio de proyectos. Crea un perfil en LinkedIn.",
  },
  {
    icon: Book,
    title: "Adquiere habilidades clave",
    description: "Aprende herramientas técnicas como Excel o idiomas básicos en plataformas en línea.",
  },
  {
    icon: Briefcase,
    title: "Gana experiencia inicial",
    description: "Participa en voluntariados, proyectos personales o pasantías.",
  },
  {
    icon: Users,
    title: "Construye tu red de contactos",
    description: "Asiste a ferias de empleo y conecta con profesionales en redes sociales.",
  },
  {
    icon: Search,
    title: "Busca programas para jóvenes",
    description: "Aplica a pasantías, trainees o empleos que no requieran experiencia previa.",
  },
  {
    icon: MessageCircle,
    title: "Prepárate para entrevistas",
    description: "Investiga las empresas y practica preguntas comunes.",
  },
  {
    icon: ThumbsUp,
    title: "Destaca tu actitud",
    description: "Enfatiza tus ganas de aprender y aportar valor desde el primer día.",
  },
] as const;

export default function FourthStep() {
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
        Cuarto Paso: Primer Empleo
      </motion.h1>
      <Card className="w-full max-w-4xl bg-slate-100">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">
            ¿Cómo conseguir tu Primer Empleo sin experiencia laboral?
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-center">
            El <strong>21%</strong> de los jóvenes en América Latina están desempleados, y el <strong>34%</strong> de
            los empleadores no contrata por falta de experiencia laboral (ManpowerGroup), lo que limita su acceso al
            mercado laboral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 sm:mb-8">
            <Progress value={(currentStep + 1) * (100 / steps.length)} className="w-full" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              {React.createElement(steps[currentStep].icon, {
                className: "w-12 h-12 sm:w-16 sm:h-16 mb-4 text-blue-600",
              })}
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{steps[currentStep].title}</h3>
              <p className="text-sm sm:text-base">{steps[currentStep].description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-center">
            <Button onClick={nextStep} className="flex items-center text-sm sm:text-base">
              {currentStep === steps.length - 1 ? "Volver a iniciar" : "Siguiente paso"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

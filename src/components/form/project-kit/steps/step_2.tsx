import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, DollarSign, Briefcase, Laptop, Smile, Lightbulb, ArrowRight, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/card";
import { Button } from "../../../shared/button";
import { Progress } from "../../../shared/progress";
import React from "react";

const reasons = [
  {
    icon: Clock,
    title: "Flexibilidad de horarios",
    description:
      "Las carreras online permiten a los jóvenes organizar su tiempo entre el estudio y el trabajo, facilitando que obtengan experiencia laboral mientras completan su formación.",
  },
  {
    icon: DollarSign,
    title: "Reducción de costos",
    description:
      "Los programas online generalmente son más económicos y, además, se reducen costos al no asistir a una universidad presencial.",
  },
  {
    icon: Briefcase,
    title: "Rápida incorporación al mercado laboral",
    description:
      "Los estudiantes pueden comenzar a trabajar desde temprano, obteniendo ingresos y experiencia laboral que complementan su educación.",
  },
  {
    icon: Laptop,
    title: "Adaptación a la era digital",
    description:
      "Las plataformas de educación online desarrollan habilidades tecnológicas esenciales, como la gestión de herramientas digitales y la comunicación remota.",
  },
  {
    icon: Smile,
    title: "Desarrollo de habilidades blandas",
    description:
      "Los estudios en línea fomentan la autodisciplina, la gestión del tiempo y la autonomía, cualidades clave para el éxito profesional.",
  },
  {
    icon: Lightbulb,
    title: "Posibilidad de estudiar y emprender",
    description:
      "Los jóvenes pueden combinar la educación online con la creación de un negocio, promoviendo una mentalidad emprendedora desde temprana edad.",
  },
  {
    icon: Brain,
    title: "Impulso de madurez y responsabilidad",
    description:
      "Trabajar mientras estudian hace que algunos jóvenes valoren más su educación y desarrollen una perspectiva más madura sobre la vida laboral y personal.",
  },
] as const;

export default function SecondStep() {
  const [currentReason, setCurrentReason] = useState(0);

  const nextReason = () => {
    setCurrentReason((prev) => (prev + 1) % reasons.length);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start p-2 sm:p-3 ">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Segundo Paso: Carrera Universitaria
      </motion.h1>
      <Card className="w-full max-w-4xl bg-slate-100">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">
            ¿Por qué elegir una carrera universitaria online?
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-center">
            En Tu-Mentor.com, como padres mentores, hemos elegido que nuestros hijos cursen sus carreras universitarias
            en modalidad online.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 sm:mb-8">
            <Progress value={(currentReason + 1) * (100 / reasons.length)} className="w-full" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReason}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              {React.createElement(reasons[currentReason].icon, {
                className: "w-12 h-12 sm:w-16 sm:h-16 mb-4 text-blue-600",
              })}
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{reasons[currentReason].title}</h3>
              <p className="text-sm sm:text-base">{reasons[currentReason].description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-center">
            <Button onClick={nextReason} className="flex items-center text-sm sm:text-base">
              {currentReason === reasons.length - 1 ? "Volver a iniciar" : "Siguiente razón"}{" "}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

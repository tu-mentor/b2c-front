import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Target, FileText, PiggyBank, Globe, TrendingUp, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../shared/accordion";

const steps = [
  {
    icon: Lightbulb,
    title: "Identificar una idea de negocio viable",
    queMaker: "Analizar problemas locales o necesidades no satisfechas.",
    herramientas: "Realizar un Canvas de modelo de negocio o usar encuestas para validar la idea.",
  },
  {
    icon: Target,
    title: "Desarrollar habilidades clave",
    queMaker: "Capacitarse en áreas relacionadas con la idea de negocio, como marketing digital, finanzas básicas o habilidades técnicas.",
    herramientas: "Plataformas como Coursera, Udemy, o programas de emprendimiento del SENA.",
  },
  {
    icon: FileText,
    title: "Crear un plan de negocios simple",
    queMaker: "Establecer objetivos claros, costos iniciales, y fuentes de ingresos. Proyectar metas a corto y mediano plazo.",
    herramientas: "Plantillas de plan de negocios gratuitas en línea.",
  },
  {
    icon: PiggyBank,
    title: "Financiamiento inicial",
    queMaker: "Acceder a microcréditos para jóvenes emprendedores. Buscar apoyos en programas gubernamentales o de ONGs que fomentan el emprendimiento juvenil.",
    herramientas: "Microcréditos, programas gubernamentales, ONGs que fomentan el emprendimiento juvenil.",
  },
  {
    icon: Globe,
    title: "Construir una presencia digital",
    queMaker: "Crear perfiles en redes sociales y una página web básica para promocionar el negocio. Usar estrategias de contenido para atraer clientes.",
    herramientas: "Canva para diseño gráfico, Instagram/Facebook para marketing inicial.",
  },
  {
    icon: TrendingUp,
    title: "Generar ingresos iniciales y escalar",
    queMaker: "Desarrollar un Producto Mínimo Viable. Ofrecer promociones para captar clientes rápidamente. Reinvertir las ganancias en el negocio para hacerlo crecer.",
    herramientas: "Priorizar la calidad del servicio/producto para fidelizar clientes.",
  },
  {
    icon: FileCheck,
    title: "Formalizar el negocio",
    queMaker: "Registrar la empresa en Cámara de Comercio y obtener el RUT para operar formalmente. Aprovechar los beneficios para jóvenes emprendedores en la formalidad, como acceso a créditos y redes empresariales.",
    herramientas: "Cámara de Comercio, RUT, beneficios para jóvenes emprendedores en la formalidad.",
  },
];

export default function FifthStep() {
  const [expandedStep, setExpandedStep] = useState<string>("step-0");

  return (
    <div className="w-full p-3 flex flex-col items-center justify-center ">
      <motion.h1
        className="text-4xl font-bold  mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Quinto Paso: Emprendimiento Juvenil
      </motion.h1>
      <Card className="w-full max-w-5xl bg-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            ¿Por qué Emprender? ¿Cuándo y cómo?
          </CardTitle>
          <CardDescription className="text-center">
            En 2022, el desempleo juvenil en Colombia fue del <strong>19.6%</strong>, versus el{" "}
            <strong>10.6%</strong> de la tasa país (DANE) y el <strong>47%</strong> trabaja en la
            informalidad (Banco Mundial); por lo anterior se destaca el emprendimiento como una
            opción para mejorar esta problemática.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion
            type="single"
            collapsible
            value={expandedStep}
            onValueChange={(value) => setExpandedStep(value || "step-0")}
          >
            {steps.map((step, index) => (
              <AccordionItem value={`step-${index}`} key={index}>
                <AccordionTrigger className="flex items-center">
                  <step.icon className="w-6 h-6 mr-2" />
                  <span>{step.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-2">
                    <strong>Qué hacer:</strong>
                    <p>{step.queMaker}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Herramientas:</strong>
                    <p>{step.herramientas}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}


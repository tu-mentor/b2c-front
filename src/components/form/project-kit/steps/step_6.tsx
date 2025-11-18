import { AnimatePresence, motion } from "framer-motion";
import { BarChart, BookOpen, PieChart, RefreshCw, Shield, TrendingUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../shared/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/card";

const financialTopics = [
  {
    icon: BarChart,
    title: "Diagnóstico Financiero Personal",
    description: "Identifica ingresos, gastos, deudas y hábitos financieros actuales.",
    tips: [
      "Usa herramientas simples como hojas de cálculo o apps gratuitas.",
      "Registra todos tus ingresos y gastos durante un mes.",
      "Identifica áreas de mejora en tus hábitos financieros.",
    ],
  },
  {
    icon: PieChart,
    title: "Conceptos Básicos de Finanzas Personales",
    description: "Aprende sobre la importancia del ahorro y cómo hacer un presupuesto efectivo.",
    tips: [
      "Utiliza el método 50-30-20 para distribuir tus ingresos.",
      "Establece metas de ahorro a corto y largo plazo.",
      "Reconoce los riesgos del sobreendeudamiento.",
    ],
  },
  {
    icon: TrendingUp,
    title: "Planificación Financiera",
    description: "Crea un plan financiero con metas claras a corto, mediano y largo plazo.",
    tips: [
      "Define objetivos financieros SMART (Específicos, Medibles, Alcanzables, Relevantes y Temporales).",
      "Desarrolla estrategias para salir de deudas si las tienes.",
      "Construye un fondo de emergencias equivalente a 3-6 meses de gastos.",
    ],
  },
  {
    icon: Shield,
    title: "Introducción a Inversiones Simples",
    description: "Aprende de productos como CDTs, fondos de inversión, ahorro programado y cuentas de alta rentabilidad.",
    tips: [
      "Investiga sobre diferentes opciones de inversión de bajo riesgo.",
      "Comprende cómo funcionan los intereses compuestos.",
      "Diversifica tus inversiones para reducir el riesgo.",
    ],
  },
  {
    icon: BookOpen,
    title: "Educación Práctica y Simulaciones",
    description: "Realiza simulaciones de decisiones financieras reales.",
    tips: [
      "Practica la creación y seguimiento de un presupuesto mensual.",
      "Simula la toma de decisiones sobre el manejo de tu primer salario.",
      "Compara diferentes opciones de crédito y sus implicaciones.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Seguimiento y Recursos Continuos",
    description: "Crea una rutina de seguimiento financiero mensual.",
    tips: [
      "Revisa y ajusta tu presupuesto regularmente.",
      "Participa en webinars y cursos en línea sobre finanzas personales.",
      "Únete a comunidades virtuales para resolver dudas y compartir experiencias.",
    ],
  },
];

export default function SixthStep() {
  return (
    <div className="w-full flex flex-col items-center justify-start p-2 sm:p-3 ">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold  mb-6 sm:mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Sexto Paso: Educación Financiera
      </motion.h1>
      <Card className="w-full max-w-4xl bg-slate-100">
        <CardHeader className="p-2 sm:p-3">
          <CardTitle className="text-xl sm:text-2xl text-center">
            ¿Por qué es necesaria una Educación Financiera a temprana edad?
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-center">
            El <strong>47%</strong> de los jóvenes colombianos entre 18 y 25 años sufre de
            sobreendeudamiento, y menos del <strong>15%</strong> recibe educación financiera formal
            (Informe Banca de las Oportunidades 2022 | Asobancaria).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-3">
          <Accordion type="single" collapsible className="w-full">
            {financialTopics.map((topic, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <topic.icon className="w-6 h-6 mr-2" />
                    <span>{topic.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="mb-4 text-sm sm:text-base">{topic.description}</p>
                      <ul className="list-disc pl-5 text-sm sm:text-base space-y-2">
                        {topic.tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{tip}</li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

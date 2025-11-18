import {
  AlertTriangle,
  ArrowUp,
  BrainCircuit,
  Briefcase,
  ClipboardList,
  FileText,
  ListFilter,
  Play,
  Star,
  Stars,
  GraduationCap,
  BookOpen,
  Target,
  Lightbulb,
  LineChart,
  Users,
  CheckCircle,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../shared/alert";
import { Button } from "../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../shared/tabs";
import VideoPopup from "../../shared/guide/video-popup";
import { PageContainer } from "@/components/shared/page-container";
import { Badge } from "../../shared/badge";

interface VocationalTestHomeProps {
  totalChildren: number
}

const VideoIndicator = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
    onClick={onClick}
  >
    <Play className="h-4 w-4" />
    Ver video
  </motion.button>
);

export default function InstructionsVocationalTest({ totalChildren }: VocationalTestHomeProps) {
  const [videoPopup, setVideoPopup] = useState<{
    isOpen: boolean
    videoSrc: string
    title: string
    description: string
  }>({
    isOpen: false,
    videoSrc: "",
    title: "",
    description: "",
  })

  const openVideoPopup = (step: string) => {
    // Here you would set the correct video source for each step
    // This is a placeholder URL - replace with actual video URLs
    const videoSrc = "/guides/" + step + ".mp4"

    const titles = {
      Holland: "Prueba de Holland",
      Chaside: "Prueba CHASIDE",
      IA: "Procesamiento con IA",
      Empleabilidad: "Datos de empleabilidad",
      Costos: "Costos de semestres"
    }

    const descriptions = {
      Holland: "Guía detallada para completar la prueba de Holland",
      Chaside: "Instrucciones para completar la prueba CHASIDE correctamente",
      IA: "Cómo procesar tus resultados con nuestra IA",
      Empleabilidad: "Acceso a los datos de empleabilidad según tus resultados",
      Costos: "Cómo consultar los costos de las carreras recomendadas",
    }

    setVideoPopup({
      isOpen: true,
      videoSrc,
      title: titles[step as keyof typeof titles],
      description: descriptions[step as keyof typeof descriptions],
    })
  }

  const closeVideoPopup = () => {
    setVideoPopup((prev) => ({ ...prev, isOpen: false }))
  }

  const breadcrumbItems = [
    {
      label: "Orientación Vocacional",
      href: "/vocational-guidance",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Instrucciones",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  const steps = [
    {
      id: 1,
      title: "Completar la prueba de Holland",
      description: "En esta prueba podrás observar distintas afirmaciones, debes responder según cuánto te identifiques con cada una de ellas. Para ello, podrás seleccionar el emoji que mejor represente tu respuesta, recuerda siempre responder de forma abierta.",
      icon: <Target className="w-6 h-6" />,
      videoKey: "Holland",
      emojis: "😕No me gusta 😐No me gusta mucho 🤷Me da igual 🙂Me gusta 😃Me encanta",
      example: "Ejemplo de una afirmación: Me gusta trabajar con personas (ej: atención al cliente, ventas, servicios)",
      colorClass: "bg-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 2,
      title: "Completar la prueba CHASIDE",
      description: "En esta prueba podrás observar distintas preguntas a las cuales deberas responder con un Si o No.",
      icon: <Lightbulb className="w-6 h-6" />,
      videoKey: "Chaside",
      example: "Ejemplo de una pregunta: ¿Prefieres trabajar en equipo? (ej: proyectos colaborativos, grupos de trabajo)",
      colorClass: "bg-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: 3,
      title: "Procesar resultados con IA",
      description: "Nuestra IA integrará los datos de ambas pruebas para generar un reporte final detallado y personalizado. Para procesar los datos debes haber completado la prueba de Holland y CHASIDE, luego navegar hasta la opción 'Resultados' en el menú, luego podrás encontrar el botón que dice IA.",
      icon: <Stars className="w-6 h-6" />,
      videoKey: "IA",
      colorClass: "bg-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: 4,
      title: "Datos de empleabilidad según tus resultados IA",
      description: "Podrás encontrar información detallada según el porcentaje de empleabilidad de acuerdo a los resultados de las dos carreras recomendadas para ti. Para acceder a esta información debes haber completado la prueba de Holland, CHASIDE y procesar tus resultados con IA, luego navegar hasta la opción 'Resultados' en el menú, luego podrás encontrar el botón que dice Empleo.",
      icon: <Briefcase className="w-6 h-6" />,
      videoKey: "Empleabilidad",
      colorClass: "bg-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      id: 5,
      title: "Costos de los semestres",
      description: "Podrás encontrar información detallada sobre el costo de estudiar las dos carreras recomendadas para ti, con comparativas en distintas instituciones educativas. Para acceder a esta información debes haber completado la prueba de Holland, CHASIDE y procesar tus resultados con IA, luego navegar hasta la opción 'Resultados' en el menú, luego podrás encontrar el botón que dice Costos.",
      icon: <FileText className="w-6 h-6" />,
      videoKey: "Costos",
      colorClass: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    }
  ];

  return (
    <PageContainer
      title="Instrucciones para las Pruebas Vocacionales"
      description="Guía completa paso a paso para completar tus pruebas vocacionales y obtener resultados personalizados."
      breadcrumbItems={breadcrumbItems}
      icon={<BookOpen className="h-6 w-6" />}
    >
      {videoPopup.isOpen && (
        <VideoPopup
          onClose={closeVideoPopup}
          videoSrc={videoPopup.videoSrc}
          title={videoPopup.title}
          description={videoPopup.description}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
                 {/* Video Tutorial Alert */}
         <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 shadow-lg">
           <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
           <CardContent className="p-6 flex items-center gap-4 relative z-10">
             <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
               <Play className="w-7 h-7" />
             </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">
                ¡Cada paso tiene un video tutorial!
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Busca los botones{" "}
                <Badge className="inline-flex items-center mx-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                  <Play className="h-3 w-3 mr-1" /> Ver video
                </Badge>{" "}
                para ver instrucciones detalladas de cada paso.
              </p>
            </div>
          </CardContent>
        </Card>

                 {/* Important Alert */}
         <Alert className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 shadow-lg">
           <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
           <AlertTitle className="text-orange-800 dark:text-orange-200 font-bold">Importante</AlertTitle>
           <AlertDescription className="text-gray-700 dark:text-gray-300">
            Cada prueba tiene sus resultados independientes. El reporte final generado por nuestra IA integrará la
            información de ambas pruebas para proporcionar una orientación vocacional más completa y precisa,
            ayudándote a tomar decisiones informadas sobre tu futuro profesional.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="process" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <TabsTrigger value="process" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg">
              <ClipboardList className="w-4 h-4 mr-2" />
              Proceso
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg">
              <Info className="w-4 h-4 mr-2" />
              Información
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="process" className="mt-8">
            <div className="space-y-8">

                             {/* Process Steps */}
               <div className="space-y-6">
        

                 {steps.map((step, index) => (
                   <motion.div
                     key={step.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                   >
                                          <Card className={`relative overflow-hidden border-2 ${step.borderColor} dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300`}>
                                              {/* Step Number Badge - Top Left */}
                       <div className={`absolute top-4 left-4 w-12 h-12 rounded-full ${step.colorClass} text-white flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800 z-20`}>
                         <span className="text-lg font-bold">{step.id}</span>
                       </div>
                       <CardContent className="p-6 pt-16 relative z-10">
                         <div className="flex items-start space-x-4">
                           <div className={`flex-shrink-0 w-14 h-14 rounded-full ${step.colorClass} text-white flex items-center justify-center shadow-lg`}>
                             {step.icon}
                           </div>
                             <div className="flex-grow space-y-4">
                               <div className="flex items-center justify-between">
                                 <div>
                                   <div className="flex items-center gap-2 mb-2">
                                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                       Paso {step.id} de 6
                                     </span>
                                   </div>
                                   <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                     {step.title}
                                   </h3>
                                 </div>
                                 <VideoIndicator onClick={() => openVideoPopup(step.videoKey)} />
                               </div>
                            
                            <div className="space-y-3">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {step.description}
                              </p>
                              
                              {step.emojis && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {step.emojis}
                                  </p>
                                </div>
                              )}
                              
                              {step.example && (
                                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                                    {step.example}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                                 <Card className="h-full border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 shadow-lg">
                   <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
                     <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                       <Target className="w-5 h-5" />
                       <span>Prueba de Holland</span>
                     </CardTitle>
                   </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Desarrollada por John Holland, esta teoría sugiere que las personas y los entornos laborales se
                      pueden clasificar en seis tipos: Realista, Investigador, Artístico, Social, Emprendedor y
                      Convencional (RIASEC). La prueba ayuda a identificar qué tipos se ajustan mejor a tu personalidad.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                                 <Card className="h-full border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 shadow-lg">
                   <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-700">
                     <CardTitle className="flex items-center space-x-2 text-purple-800 dark:text-purple-200">
                       <Lightbulb className="w-5 h-5" />
                       <span>Prueba CHASIDE</span>
                     </CardTitle>
                   </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      CHASIDE es un acrónimo que representa diferentes áreas de interés y aptitudes: Administrativas,
                      Humanísticas, Artísticas, Sanitarias, Informáticas, Defensa y Seguridad, y Ciencias Exactas. Esta
                      prueba evalúa tus inclinaciones hacia estas áreas para guiar tu elección vocacional.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageContainer>
  )
}
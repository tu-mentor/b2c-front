import { motion } from "framer-motion";
import { FileSpreadsheet, Flag, Globe } from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../shared/accordion";
import { Button } from "../../../shared/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../shared/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/tabs";

const skills = [
  {
    name: "Inglés",
    icon: Globe,
    description:
      "En Cali como ciudad-región, más de <b>180,000</b> habitantes tienen conocimientos de inglés, pero la creciente inversión extranjera en sectores como BPO, tecnología y manufactura sigue demandando talento bilingüe.",
    why: [
      "Un buen nivel de inglés permite a los jóvenes acceder a su primer empleo con un salario base que puede duplicar o triplicar el salario mínimo legal vigente.",
      'Posibilidad de hospedar en tu hogar a ciudadanos de habla inglesa u otras nacionalidades, facilitando intercambios culturales mediante el inglés, reconocido como el "idioma universal".',
    ],
    how: [
      {
        title: "1. Realiza un Diagnóstico Inicial",
        steps: [
          "Realiza un test de nivel gratuito para identificar dónde te encuentras (A1, A2, B1, B2, C1).",
          "Establece metas específicas: ¿Qué nivel deseas alcanzar y en qué tiempo?",
        ],
      },
      {
        title: "2. Diseña un Plan de Estudio",
        steps: [
          "Dedica 1-2 horas diarias divididas en las cuatro habilidades básicas:",
          "- Lectura: 30 minutos diarios de artículos, libros o noticias adaptados a tu nivel.",
          "- Escritura: 20 minutos escribiendo diarios, correos o frases simples.",
          "- Escucha: 30 minutos escuchando podcasts, canciones o audiolibros.",
          "- Habla: 30 minutos practicando monólogos, lectura en voz alta o intercambios lingüísticos.",
        ],
      },
      {
        title: "3. Usa Recursos Educativos",
        steps: [
          "Lectura:",
          "- Libros adaptados a tu nivel (graded readers).",
          "- Artículos en inglés en sitios como BBC Learning English.",
          "Escucha:",
          "- Canciones con letras disponibles para seguir el ritmo.",
          '- Podcasts como "ESLPod" o "BBC Learning English".',
          "Escritura:",
          "- Escribe un diario personal en inglés.",
          "- Crea frases o resúmenes de los textos leídos o escuchados.",
          "Habla:",
          "- Lee en voz alta frente al espejo.",
          "- Practica conversaciones con amigos o grupos de intercambio local.",
        ],
      },
      {
        title: "4. Refuerza el Vocabulario",
        steps: [
          "Aprende 5-10 palabras nuevas cada día.",
          "Usa flashcards físicas para memorizar.",
          "Aplica las palabras aprendidas en oraciones y conversaciones.",
        ],
      },
      {
        title: "5. Práctica de Gramática",
        steps: [
          "Trabaja con libros especializados según tu nivel, como English Grammar in Use.",
          "Dedica tiempo a ejercicios escritos y revisa las respuestas para aprender de los errores.",
        ],
      },
      {
        title: "6. Inmersión en el Idioma",
        steps: [
          "Películas y series: Mira contenido en inglés con subtítulos en inglés para principiantes, luego sin subtítulos.",
          "Música: Escucha canciones en inglés, intenta comprender las letras y cántalas.",
        ],
      },
      {
        title: "7. Evaluación y Ajustes",
        steps: [
          "Cada tres meses, repite un test de nivel para medir tu progreso.",
          "Ajusta las actividades según las habilidades que necesiten más atención.",
        ],
      },
      {
        title: "8. Aplicación Práctica",
        steps: [
          "Participa en actividades reales donde uses inglés:",
          "- Conversaciones con turistas o extranjeros.",
          "- Clubes de conversación o intercambios lingüísticos.",
        ],
      },
    ],
  },
  {
    name: "Microsoft Excel",
    icon: FileSpreadsheet,
    description:
      "Microsoft Excel es la herramienta universal preferida en la gestión y análisis de datos, esencial para optimizar procesos, tomar decisiones informadas y destacar en el ámbito laboral en múltiples sectores.",
    why: [
      "Un joven con nivel avanzado en Microsoft Excel destaca en su búsqueda de primer empleo, al ser una habilidad clave que las empresas valoran por su impacto en la productividad y gestión de datos.",
      "Ayuda a jóvenes emprendedores a gestionar presupuestos, proyecciones financieras y control de inventarios de forma profesional.",
    ],
    how: [
      {
        title: "1. Nivel Principiante",
        steps: [
          "Objetivo: Dominar lo básico.",
          "Actividades:",
          "- Aprende interfaces, celdas, filas, columnas y formatos básicos.",
          "- Práctica con funciones simples: SUMA, PROMEDIO, CONTAR.",
          "Recurso: Tutoriales básicos gratuitos en YouTube o blogs especializados.",
        ],
      },
      {
        title: "2. Nivel Intermedio",
        steps: [
          "Objetivo: Manejar datos con mayor precisión.",
          "Actividades:",
          "- Creación de tablas dinámicas y uso de gráficos.",
          "- Introducción a funciones lógicas como SI, BUSCARV, y CONCATENAR.",
          "- Uso de filtros y ordenamiento avanzado.",
          "Recurso: Cursos online económicos en Udemy o Coursera.",
        ],
      },
      {
        title: "3. Nivel Avanzado",
        steps: [
          "Objetivo: Automatizar y analizar datos complejos.",
          "Actividades:",
          "- Aprender macros y programación en VBA.",
          "- Trabajar con funciones avanzadas: ÍNDICE, COINCIDIR, y ANIDACIONES.",
          "- Construir dashboards interactivos y análisis de datos.",
          "Recurso: Libros especializados y proyectos prácticos.",
        ],
      },
      {
        title: "4. Evaluación y Práctica",
        steps: [
          "Realiza proyectos pequeños que integren gráficos, tablas dinámicas y macros.",
          "Toma tests gratuitos para medir tu nivel y ajustar tu aprendizaje.",
        ],
      },
    ],
  },
  {
    name: "Japonés",
    icon: Flag,
    description:
      "Japón, la <b>tercera</b> economía más grande del mundo, ofrece becas integrales para colombianos a través del Programa Monbukagakusho, dirigidas a quienes deseen realizar estudios de pregrado o posgrado en Japón.",
    why: [
      "El japonés es la llave para sumergirse en la rica cultura japonesa, abarcando desde su literatura y cine, hasta el manga, anime, gastronomía y tradiciones únicas.",
      "Posibilidad de hospedar en tu hogar a ciudadanos japoneses, facilitando el intercambio cultural mediante el idioma Japonés.",
    ],
    how: [
      {
        title: "1. Nivel Principiante",
        steps: [
          "Objetivo: Familiarizarse con lo básico.",
          "Actividades:",
          "- Aprende los alfabetos Hiragana y Katakana.",
          "- Conoce vocabulario básico y frases comunes.",
          "- Practica pronunciación con canciones o diálogos simples.",
          "Recurso: Aplicaciones como Duolingo.",
        ],
      },
      {
        title: "2. Nivel Intermedio",
        steps: [
          "Objetivo: Construir conversaciones simples.",
          "Actividades:",
          "- Estudia gramática básica: partículas (は, を, に) y formas verbales simples.",
          "- Lee textos sencillos (e.g., manga para principiantes).",
          "- Escucha podcasts o videos en japonés con subtítulos.",
          "Recurso: Libros como Genki I & II o Minna no Nihongo.",
        ],
      },
      {
        title: "3. Nivel Avanzado",
        steps: [
          "Objetivo: Comprender y comunicar ideas complejas.",
          "Actividades:",
          "- Aprende kanjis esenciales y amplia vocabulario técnico.",
          "- Practica con textos avanzados como artículos o noticias.",
          "- Realiza conversaciones largas y escribe textos formales.",
          "Recurso: JLPT prep books (N3-N1) y grupos de conversación.",
        ],
      },
      {
        title: "4. Evaluación y Práctica",
        steps: [
          "Realiza el examen JLPT para medir tu progreso.",
          "Ver contenido japonés sin subtítulos y practicar con hablantes nativos.",
        ],
      },
    ],
  },
];

export default function FirstStep() {
  const [selectedSkill, setSelectedSkill] = useState(skills[0]);

  return (
    <div className="w-full flex flex-col items-center justify-start p-2 sm:p-3 bg-background">
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Primer Paso: Adquiere Habilidades Duras
      </motion.h1>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 w-full">
        {skills.map((skill, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={selectedSkill.name === skill.name ? "default" : "outline"}
              onClick={() => setSelectedSkill(skill)}
              className={`flex items-center gap-2 text-xs sm:text-sm ${
                selectedSkill.name === skill.name
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              <skill.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {skill.name}
            </Button>
          </motion.div>
        ))}
      </div>
      <Card className="bg-card text-card-foreground w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <selectedSkill.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            {selectedSkill.name}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            <div dangerouslySetInnerHTML={{ __html: selectedSkill.description }} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="why" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="why">¿Por qué?</TabsTrigger>
              <TabsTrigger value="how">¿Cómo?</TabsTrigger>
            </TabsList>
            <TabsContent value="why">
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                {selectedSkill.why.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {reason}
                  </motion.li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="how">
              <Accordion type="single" collapsible className="w-full">
                {selectedSkill.how.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                        {section.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

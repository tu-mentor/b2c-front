import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart2,
  Book,
  Clock,
  DollarSign,
  FileQuestion,
  GitCompareIcon,
  School,
  Search,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
import { RadarChart } from "../../../shared/radar-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/table";
import careersData from "./careers.json";
import type { Career, CareersData, University } from "./types_career";
import { PageContainer } from "@/components/shared/page-container";

interface CareerComparisonProps {
  recommendedCareers: Career[];
}

export function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(de|del|la|los|las|y|e|o|u)\b/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

const careerMappings = {
  "Administración de Empresas": [
    "Administración",
    "Gestión Empresarial",
    "Negocios",
    "Administración de Negocios",
    "Gerencia",
    "Gestión Organizacional",
    "Administración Pública",
    "Gestión Humana",
  ],
  Arquitectura: [
    "Diseño Arquitectónico",
    "Urbanismo",
    "Arquitectura y Urbanismo",
    "Diseño de Interiores",
    "Planificación Urbana",
    "Restauración Arquitectónica",
  ],
  "Comunicación Social": [
    "Periodismo",
    "Comunicación",
    "Medios",
    "Comunicación Social y Periodismo",
    "Comunicación Audiovisual",
    "Relaciones Públicas",
    "Comunicación Organizacional",
  ],
  "Contaduría Pública": [
    "Contabilidad",
    "Auditoría",
    "Contador",
    "Ciencias Contables",
    "Finanzas Corporativas",
    "Tributación",
  ],
  Derecho: [
    "Leyes",
    "Jurisprudencia",
    "Ciencias Jurídicas",
    "Derecho y Ciencias Políticas",
    "Derecho Internacional",
    "Criminología",
    "Derecho Penal",
  ],
  Economía: [
    "Ciencias Económicas",
    "Finanzas",
    "Economía y Finanzas",
    "Econometría",
    "Política Económica",
    "Desarrollo Económico",
  ],
  "Finanzas y Negocios Internacionales": [
    "Comercio Internacional",
    "Negocios Globales",
    "Finanzas Internacionales",
    "Economía Internacional",
    "Relaciones Económicas Internacionales",
    "Administración de Negocios Internacionales",
  ],
  "Ingeniería Electrónica": [
    "Electrónica",
    "Telecomunicaciones",
    "Ingeniería Electrónica y Telecomunicaciones",
    "Automatización",
    "Robótica",
    "Ingeniería Eléctrica",
  ],
  "Ingeniería Industrial": [
    "Ingeniería de Procesos",
    "Optimización Industrial",
    "Ingeniería de Producción",
    "Logística",
    "Gestión de Calidad",
    "Ingeniería de Operaciones",
  ],
  "Ingeniería de Sistemas": [
    "Ingeniería Informática",
    "Ingeniería de Software",
    "Ciencias de la Computación",
    "Sistemas y Computación",
    "Desarrollo de Software",
    "Seguridad Informática",
  ],
  Medicina: ["Ciencias de la Salud", "Medicina General", "Medicina y Cirugía"],
  Mercadeo: [
    "Marketing",
    "Publicidad",
    "Ventas",
    "Comunicación Comercial",
    "Mercadeo y Publicidad",
    "Negocios Internacionales",
    "Comercio Exterior",
  ],
  Psicología: [
    "Ciencias del Comportamiento",
    "Psicoterapia",
    "Psicología Clínica",
    "Psicología Organizacional",
    "Psicología Social",
    "Neuropsicología",
    "Psicología Educativa",
  ],
  "Licenciatura en Ciencias Sociales": [
    "Educación en Ciencias Sociales",
    "Pedagogía Social",
    "Enseñanza de Historia y Geografía",
  ],
  "Licenciatura en Matemáticas": [
    "Educación Matemática",
    "Didáctica de las Matemáticas",
    "Enseñanza de Matemáticas",
  ],
  "Licenciatura en Ciencias Naturales": [
    "Educación en Ciencias",
    "Enseñanza de Biología y Química",
    "Didáctica de las Ciencias Naturales",
  ],
  "Licenciatura en Educación Infantil": [
    "Pedagogía Infantil",
    "Educación Preescolar",
    "Desarrollo Infantil Temprano",
  ],
  "Licenciatura en Educación Artística": [
    "Educación en Artes",
    "Pedagogía Artística",
    "Enseñanza de Expresión Artística",
  ],
  "Licenciatura en Educación Física y Deporte": [
    "Pedagogía en Educación Física",
    "Entrenamiento Deportivo",
    "Ciencias del Deporte",
  ],
  "Licenciatura en Ciencias del Deporte y la Educación Física": [
    "Gestión Deportiva",
    "Fisiología del Ejercicio",
    "Biomecánica Deportiva",
  ],
  "Licenciatura en Lenguas Extranjeras": [
    "Enseñanza de Idiomas",
    "Lingüística Aplicada",
    "Filología",
  ],
  Publicidad: ["Diseño Publicitario", "Estrategia Publicitaria", "Comunicación Publicitaria"],
  "Licenciatura en Literatura y Lengua Castellana": [
    "Estudios Literarios",
    "Lingüística Hispánica",
    "Enseñanza de Lengua y Literatura",
  ],
  "Licenciatura en Educación Física": [
    "Recreación y Deporte",
    "Actividad Física y Salud",
    "Didáctica de la Educación Física",
  ],
  "Administración Financiera": [
    "Gestión Financiera",
    "Análisis Financiero",
    "Finanzas Corporativas",
  ],
  "Trabajo Social": ["Intervención Social", "Política Social", "Desarrollo Comunitario"],
  Química: ["Química Pura", "Química Industrial", "Química Analítica"],
  Microbiología: ["Bacteriología", "Virología", "Inmunología"],
  "Comercio Internacional": ["Negocios Internacionales", "Logística Internacional", "Aduanas"],
  "Química Farmacéutica": ["Farmacología", "Biofarmacia", "Tecnología Farmacéutica"],
  "Medicina Veterinaria": ["Salud Animal", "Zootecnia", "Clínica Veterinaria"],
  Fisioterapia: ["Rehabilitación Física", "Kinesiología", "Terapia Manual"],
  Enfermería: ["Cuidados de Enfermería", "Enfermería Clínica", "Salud Pública"],
  Filosofía: ["Ética", "Lógica", "Historia de la Filosofía"],
  Odontología: ["Estomatología", "Cirugía Dental", "Ortodoncia"],
  "Publicidad en Medios Digitales": ["Marketing Digital", "Diseño Web", "Redes Sociales"],
  "Diseño Gráfico": ["Diseño Visual", "Ilustración", "Diseño Editorial"],
  "Diseño Industrial": ["Diseño de Productos", "Ergonomía", "Prototipado"],
  "Nutrición y Dietética": ["Ciencias de la Alimentación", "Dietoterapia", "Nutrición Clínica"],
  Cine: ["Dirección Cinematográfica", "Producción Audiovisual", "Guion"],
  Biología: ["Biología Molecular", "Ecología", "Genética"],
  "Artes Visuales": ["Pintura", "Escultura", "Fotografía Artística"],
  Antropología: ["Antropología Social", "Antropología Cultural", "Arqueología"],
  "Bacteriología y Laboratorio Clínico": [
    "Análisis Clínicos",
    "Microbiología Clínica",
    "Hematología",
  ],
  Sociología: ["Investigación Social", "Sociología Urbana", "Demografía"],
  "Diseño de Comunicación Visual": [
    "Diseño de Interfaces",
    "Diseño de Experiencia de Usuario",
    "Diseño de Información",
  ],
  "Diseño de Medios Interactivos": [
    "Diseño de Videojuegos",
    "Diseño de Aplicaciones",
    "Animación Digital",
  ],
  Música: ["Composición Musical", "Interpretación Musical", "Producción Musical"],
  "Negocios Internacionales": ["Comercio Exterior", "Logística Internacional", "Estrategia Global"],
  "Ingeniería Comercial": ["Gestión Comercial", "Marketing Estratégico", "Ventas Corporativas"],
  BioIngeniería: ["Ingeniería Biomédica", "Biotecnología", "Biomateriales"],
  "Ingeniería en Energías": [
    "Energías Renovables",
    "Eficiencia Energética",
    "Sistemas de Potencia",
  ],
  "Ingeniería Civil": ["Estructuras", "Geotecnia", "Hidráulica"],
  "Ingeniería Química": ["Procesos Químicos", "Termodinámica", "Diseño de Plantas"],
  "Ingeniería de Datos e Inteligencia Artificial": [
    "Big Data",
    "Machine Learning",
    "Análisis Predictivo",
    "Inteligencia Artificial",
    "Data Science",
  ],
  "Ingeniería de Manufactura": [
    "Procesos de Fabricación",
    "Automatización Industrial",
    "Control de Calidad",
  ],
  "Ingeniería Eléctrica": ["Sistemas Eléctricos", "Electrónica de Potencia", "Control Automático"],
  "Ingeniería Empresarial": [
    "Gestión de Proyectos",
    "Optimización de Procesos",
    "Innovación Empresarial",
  ],
  "Ingeniería Mecánica": ["Diseño Mecánico", "Termofluidos", "Materiales"],
  "Ingeniería Ambiental": ["Gestión Ambiental", "Tratamiento de Aguas", "Energías Limpias"],
  "Ingeniería Multimedia": ["Desarrollo Web", "Diseño de Interfaces", "Producción Audiovisual"],
  "Ingeniería Biomédica": ["Instrumentación Médica", "Biomecánica", "Ingeniería Clínica"],
  "Ingeniería Mecatrónica": ["Robótica", "Sistemas de Control", "Automatización Industrial"],
  "Ingeniería Agroindustrial": [
    "Procesamiento de Alimentos",
    "Gestión de Calidad Alimentaria",
    "Desarrollo de Productos",
  ],
  "Ingeniería Bioquímica": ["Bioprocesos", "Biotecnología Industrial", "Biocatálisis"],
  "Ingeniería en Energía Inteligente": [
    "Redes Inteligentes",
    "Gestión Energética",
    "Energías Alternativas",
  ],
};

function findMatchingCareer(recommendedCareer: string, allCareers: Career[]): Career | undefined {
  const normalizedRecommendedCareer = normalizeString(recommendedCareer);

  // Buscar coincidencia directa en las carreras principales
  for (const [mainCareer, aliases] of Object.entries(careerMappings)) {
    if (
      normalizeString(mainCareer) === normalizedRecommendedCareer ||
      aliases.some((alias) => normalizeString(alias) === normalizedRecommendedCareer)
    ) {
      return allCareers.find(
        (career) => normalizeString(career.name) === normalizeString(mainCareer)
      );
    }
  }

  // Si no se encuentra una coincidencia directa, buscar coincidencia parcial
  for (const [mainCareer, aliases] of Object.entries(careerMappings)) {
    if (
      normalizedRecommendedCareer.includes(normalizeString(mainCareer)) ||
      aliases.some((alias) => normalizedRecommendedCareer.includes(normalizeString(alias)))
    ) {
      return allCareers.find(
        (career) => normalizeString(career.name) === normalizeString(mainCareer)
      );
    }
  }

  // Si aún no hay coincidencia, buscar la carrera más similar
  const similarCareer = allCareers.find(
    (career) =>
      normalizeString(career.name).includes(normalizedRecommendedCareer) ||
      normalizedRecommendedCareer.includes(normalizeString(career.name))
  );

  if (similarCareer) {
    return similarCareer;
  }
}

export default function CareerComparison({ recommendedCareers }: CareerComparisonProps) {
  const [allCareers, setAllCareers] = useState<Career[]>([]);
  const [displayedCareers, setDisplayedCareers] = useState<Career[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const careers = (careersData as CareersData).careers;
    setAllCareers(careers);

    const initialRecommendedCareers = recommendedCareers
      .map((recommendedCareer) => findMatchingCareer(recommendedCareer.name, careers))
      .filter((career): career is Career => career !== undefined);

    setDisplayedCareers(initialRecommendedCareers);
    setSelectedCareers(initialRecommendedCareers);
    setComparisonData(generateComparisonData(initialRecommendedCareers));
    setIsLoading(false);
  }, [recommendedCareers]);

  useEffect(() => {
    const recommendedCareersData = recommendedCareers
      .map((recommendedCareer) => findMatchingCareer(recommendedCareer.name, allCareers))
      .filter((career): career is Career => career !== undefined);
    setDisplayedCareers(recommendedCareersData);
  }, [allCareers, recommendedCareers]);

  function generateComparisonData(careers: Career[]): (University & { careerName: string })[] {
    const data = careers.flatMap((career) =>
      career.universities.map((uni) => ({
        careerName: career.name,
        ...uni,
      }))
    );

    // Sort the data by firstSemesterValue in ascending order
    return data.sort((a, b) => {
      const valueA = a.firstSemesterValue || 0;
      const valueB = b.firstSemesterValue || 0;
      return valueA - valueB;
    });
  }

  const handleCareerSelect = (career: Career) => {
    if (
      selectedCareers.length < 5 &&
      !selectedCareers.some((c) => normalizeString(c.name) === normalizeString(career.name))
    ) {
      const updatedSelectedCareers = [...selectedCareers, career];
      setSelectedCareers(updatedSelectedCareers);
      setComparisonData(generateComparisonData(updatedSelectedCareers));
    }
  };

  const handleCareerRemove = (career: Career) => {
    const updatedSelectedCareers = selectedCareers.filter(
      (c) => normalizeString(c.name) !== normalizeString(career.name)
    );
    setSelectedCareers(updatedSelectedCareers);
    setComparisonData(generateComparisonData(updatedSelectedCareers));
  };

  const [comparisonData, setComparisonData] = useState<(University & { careerName: string })[]>([]);

  const getAverageFirstSemesterValue = (career: Career) => {
    const values = career.universities
      .map((uni) => uni.firstSemesterValue)
      .filter((value) => value !== null) as number[];
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  // Verificar si no hay resultados para mostrar
  const noResults =
    !isLoading && (recommendedCareers.length === 0 || displayedCareers.length === 0);

  const breadcrumbItems = [
    {
      label: "Orientación Vocacional",
      href: "/vocational-guidance",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Costos de Carreras",
      icon: <DollarSign className="h-4 w-4" />,
    },
  ];

  return (
    <PageContainer
      title="Costos de Carreras"
      description="Costos de diferentes carreras para tomar una decisión informada sobre tu futuro."
      breadcrumbItems={breadcrumbItems}
      icon={<DollarSign className="h-6 w-6" />}
    >
      <div className="container mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : noResults ? (
          <NoResultsMessage />
        ) : (
          <>
            <AnimatePresence>
              {displayedCareers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
                >
                  {displayedCareers.map((career) => (
                    <motion.div
                      key={career.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Book className="mr-2" />
                            {career.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            <School className="inline-block mr-2" />
                            {career.universities.length} universidades ofrecen este programa
                          </p>
                          <p className="text-gray-600 mb-4">
                            <DollarSign className="inline-block mr-2" />
                            Promedio primer semestre:{" "}
                            {getAverageFirstSemesterValue(career).toLocaleString("es-CO", {
                              style: "currency",
                              currency: "COP",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {selectedCareers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <h2 className="text-2xl font-bold mb-4">
                  {selectedCareers.length > 1 ? "Costos de Carreras" : "Detalles de la Carrera"}
                </h2>
                {comparisonData.length > 0 ? (
                  <div className="space-y-8">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Carrera</TableHead>
                            <TableHead>Universidad</TableHead>
                            <TableHead>Modalidad</TableHead>
                            <TableHead>Total Periodos</TableHead>
                            <TableHead>Valor Primer Semestre</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {comparisonData.map((item, index) => (
                            <TableRow key={`${item.careerName}-${item.name}-${index}`}>
                              <TableCell>{item.careerName}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <School className="mr-2" />
                                  {item.name}
                                </div>
                              </TableCell>
                              <TableCell>{item.modality}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Clock className="mr-2" />
                                  {item.totalPeriods}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <DollarSign className="mr-2" />
                                  {item.firstSemesterValue
                                    ? item.firstSemesterValue.toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                      })
                                    : "N/A"}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-18">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Award className="mr-2" />
                            Resumen de Carreras
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {selectedCareers.map((career) => (
                              <div key={career.name} className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-bold mb-2">{career.name}</h3>
                                <p>Universidades: {career.universities.length}</p>
                                <p>
                                  Costo promedio:{" "}
                                  {getAverageFirstSemesterValue(career).toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  })}
                                </p>
                                <p>Duración: {career.universities[0].totalPeriods} periodos</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <TrendingUp className="mr-2" />
                            Duración de Programas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedCareers.map((career) => (
                              <div key={career.name} className="flex items-center">
                                <div className="w-1/3">{career.name}</div>
                                <div className="w-2/3 bg-gray-200 rounded-full h-4">
                                  <div
                                    className="bg-blue-600 rounded-full h-4"
                                    style={{
                                      width: `${(career.universities[0].totalPeriods / 12) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="ml-2">
                                  {career.universities[0].totalPeriods} periodos
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    {selectedCareers.length === 0
                      ? "No hay carreras seleccionadas. Por favor, seleccione al menos una carrera."
                      : "No hay datos disponibles para comparar."}
                  </p>
                )}
              </motion.div>
            )}
            {selectedCareers.some((career) => career.universities.length === 0) && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GitCompareIcon className="mr-2" />
                    Carreras sin datos disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Las siguientes carreras recomendadas no tienen datos disponibles en nuestro
                    sistema:
                  </p>
                  <ul className="list-disc list-inside">
                    {selectedCareers
                      .filter((career) => career.universities.length === 0)
                      .map((career) => (
                        <li key={career.name} className="text-gray-800">
                          {career.name}
                        </li>
                      ))}
                  </ul>
                  <p className="text-gray-600 mt-4">
                    Estamos trabajando para agregar más información sobre estas carreras. Mientras
                    tanto, te recomendamos investigar directamente en las universidades de tu interés.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}

function NoResultsMessage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 my-12 bg-white rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 mb-6 text-indigo-500 opacity-80"
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 100,
        }}
      >
        <Search className="w-full h-full" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gray-700 mb-3 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        No se encontraron resultados
      </motion.h2>

      <motion.div
        className="max-w-md text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="mb-2">
          No hay datos disponibles para las carreras recomendadas en este momento.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {[Book, School, FileQuestion].map((Icon, index) => (
          <motion.div
            key={index}
            className="p-3 bg-gray-100 rounded-full"
            whileHover={{
              y: -5,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f0f4ff",
            }}
          >
            <Icon className="w-8 h-8 text-indigo-400" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

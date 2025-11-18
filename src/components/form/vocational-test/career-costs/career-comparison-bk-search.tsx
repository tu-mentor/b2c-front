
import { AnimatePresence, motion } from "framer-motion";
import { Book, Clock, DollarSign, GitCompareIcon, School, Search, BarChart2, TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from "react";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
import { Input } from "../../../shared/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/table";
import careersData from "./careers.json";
import { Career, CareersData, University } from "./types_career";
import { RadarChart } from "../../../shared/radar-chart";

interface CareerComparisonProps {
  recommendedCareers: string[];
}

export function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(de|del|la|los|las|y|e|o|u)\b/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

function findMatchingCareer(recommendedCareer: string, allCareers: Career[]): Career | undefined {
  const normalizedRecommendedCareer = normalizeString(recommendedCareer);
  
  // Direct match
  const directMatch = allCareers.find(career => normalizeString(career.name) === normalizedRecommendedCareer);
  if (directMatch) return directMatch;

  // Partial match
  const partialMatch = allCareers.find(career => {
    const normalizedCareerName = normalizeString(career.name);
    return normalizedCareerName.includes(normalizedRecommendedCareer) || 
           normalizedRecommendedCareer.includes(normalizedCareerName);
  });
  if (partialMatch) return partialMatch;

  // Specific mappings
  const careerMappings: { [key: string]: string[] } = {
    "Administración de Empresas": ["Administración", "Gestión Empresarial", "Negocios"],
    "Arquitectura": ["Diseño Arquitectónico", "Urbanismo"],
    "Comunicación Social": ["Periodismo", "Comunicación", "Medios"],
    "Contaduría Pública": ["Contabilidad", "Auditoría", "Contador"],
    "Derecho": ["Leyes", "Jurisprudencia", "Ciencias Jurídicas"],
    "Economía": ["Ciencias Económicas", "Finanzas"],
    "Finanzas y Negocios Internacionales": ["Comercio Internacional", "Negocios Globales", "Finanzas Internacionales"],
    "Ingeniería Electrónica": ["Electrónica", "Telecomunicaciones"],
    "Ingeniería Industrial": ["Ingeniería de Procesos", "Optimización Industrial"],
    "Ingeniería de Sistemas": ["Ingeniería Informática", "Ingeniería de Software", "Ciencias de la Computación"],
    "Licenciatura": ["Educación", "Pedagogía", "Docencia"],
    "Medicina": ["Ciencias de la Salud", "Medicina General"],
    "Mercadeo": ["Marketing", "Publicidad", "Ventas"],
    "Psicología": ["Ciencias del Comportamiento", "Psicoterapia"],
    "Ingeniería": ["Ingeniería General", "Ciencias Aplicadas"],
    "Otras Carreras": ["Programas Adicionales", "Carreras Alternativas"],
    // Additional mappings for potential career variations
    "Ingeniería de Software": ["Ingeniería de Sistemas", "Desarrollo de Software"],
    "Científico de Datos": ["Ciencia de Datos", "Análisis de Datos", "Ingeniería de Sistemas", "Estadística", "Matemáticas"],
    "Contador": ["Contaduría Pública", "Finanzas"],
    "Administración Pública": ["Gestión Pública", "Políticas Públicas"],
    "Biología": ["Ciencias Biológicas", "Biotecnología"],
    "Química": ["Ingeniería Química", "Bioquímica"],
    "Física": ["Ciencias Físicas", "Ingeniería Física"],
    "Matemáticas": ["Ciencias Matemáticas", "Estadística"],
    "Ingeniería Civil": ["Construcción", "Infraestructura"],
    "Ingeniería Mecánica": ["Mecatrónica", "Diseño Mecánico"],
    "Ingeniería Ambiental": ["Ciencias Ambientales", "Gestión Ambiental"],
    "Diseño Gráfico": ["Diseño Visual", "Comunicación Visual"],
    "Enfermería": ["Ciencias de la Enfermería", "Cuidados de Salud"],
    "Odontología": ["Ciencias Dentales", "Estomatología"],
    "Veterinaria": ["Medicina Veterinaria", "Ciencias Animales"],
    "Nutrición": ["Dietética", "Ciencias de la Alimentación"],
    "Trabajo Social": ["Servicios Sociales", "Intervención Social"],
    "Sociología": ["Estudios Sociales", "Antropología"],
    "Filosofía": ["Pensamiento Crítico", "Ética"],
    "Historia": ["Estudios Históricos", "Patrimonio Cultural"],
    "Lenguas Modernas": ["Lingüística", "Traducción e Interpretación"],
    "Artes Plásticas": ["Bellas Artes", "Artes Visuales"],
    "Música": ["Estudios Musicales", "Composición"],
    "Teatro": ["Artes Escénicas", "Actuación"],
    "Cine y Televisión": ["Producción Audiovisual", "Medios Digitales"],
    "Gastronomía": ["Artes Culinarias", "Gestión de Restaurantes"],
    "Hotelería y Turismo": ["Gestión Turística", "Hospitalidad"],
    "Relaciones Internacionales": ["Diplomacia", "Estudios Globales"],
    "Ciencias Políticas": ["Gobierno", "Estudios Políticos"],
    "Geología": ["Ciencias de la Tierra", "Geociencias"],
    "Astronomía": ["Astrofísica", "Ciencias del Espacio"],
    "Agronomía": ["Ciencias Agrícolas", "Ingeniería Agrónoma"],
    "Zootecnia": ["Producción Animal", "Ciencias Pecuarias"],
    "Ingeniería de Alimentos": ["Tecnología de Alimentos", "Procesamiento de Alimentos"],
    "Ingeniería Biomédica": ["Bioingeniería", "Ingeniería Médica"],
    "Ingeniería de Telecomunicaciones": ["Redes", "Comunicaciones"],
    "Ingeniería Aeroespacial": ["Ingeniería Aeronáutica", "Ciencias Espaciales"],
    "Ingeniería Naval": ["Arquitectura Naval", "Ingeniería Marítima"],
    "Ingeniería de Petróleos": ["Ingeniería Petrolera", "Hidrocarburos"],
    "Ingeniería Forestal": ["Ciencias Forestales", "Silvicultura"],
    "Terapia Ocupacional": ["Rehabilitación", "Ergoterapia"],
    "Fisioterapia": ["Terapia Física", "Kinesiología"],
    "Fonoaudiología": ["Logopedia", "Terapia del Lenguaje"],
    "Optometría": ["Ciencias de la Visión", "Óptica"],
    "Bibliotecología": ["Ciencias de la Información", "Gestión Documental"],
    "Archivística": ["Gestión de Archivos", "Documentación"],
    "Criminología": ["Ciencias Forenses", "Investigación Criminal"],
    "Seguridad y Salud en el Trabajo": ["Prevención de Riesgos Laborales", "Higiene Industrial"]
  };

  const mappedCareers = careerMappings[recommendedCareer] || [];
  for (const mappedCareer of mappedCareers) {
    const match = allCareers.find(career => normalizeString(career.name) === normalizeString(mappedCareer));
    if (match) return match;
  }

  return undefined;
}

export default function CareerComparison({ recommendedCareers }: CareerComparisonProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allCareers, setAllCareers] = useState<Career[]>([]);
  const [displayedCareers, setDisplayedCareers] = useState<Career[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([]);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonData, setComparisonData] = useState<(University & { careerName: string })[]>([]);

  useEffect(() => {
    const careers = (careersData as CareersData).careers;
    setAllCareers(careers);

    const initialRecommendedCareers = recommendedCareers
      .map(recommendedCareer => findMatchingCareer(recommendedCareer, careers))
      .filter((career): career is Career => career !== undefined);

    setDisplayedCareers(initialRecommendedCareers);
    setSelectedCareers(initialRecommendedCareers);
    setComparisonData(generateComparisonData(initialRecommendedCareers));
  }, [recommendedCareers]);

  useEffect(() => {
    if (searchTerm) {
      const matches = allCareers.filter((career) =>
        career.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedCareers(matches);
    } else {
      const recommendedCareersData = recommendedCareers
        .map(recommendedCareer => findMatchingCareer(recommendedCareer, allCareers))
        .filter((career): career is Career => career !== undefined);
      setDisplayedCareers(recommendedCareersData);
    }
  }, [searchTerm, allCareers, recommendedCareers]);

  function generateComparisonData(careers: Career[]): (University & { careerName: string })[] {
    return careers.flatMap((career) =>
      career.universities.map((uni) => ({
        careerName: career.name,
        ...uni,
      }))
    );
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

  const toggleComparison = () => {
    setIsComparing(!isComparing);
  };

  const getAverageFirstSemesterValue = (career: Career) => {
    const values = career.universities
      .map((uni) => uni.firstSemesterValue)
      .filter((value) => value !== null) as number[];
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Comparador de Carreras
      </motion.h1>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar una carrera..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
                    <Button
                      onClick={() => handleCareerSelect(career)}
                      disabled={selectedCareers.some((c) => normalizeString(c.name) === normalizeString(career.name))}
                      className="w-full"
                    >
                      {selectedCareers.some((c) => normalizeString(c.name) === normalizeString(career.name))
                        ? "Seleccionada"
                        : "Seleccionar para comparar"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedCareers.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Carreras Seleccionadas</h2>
          <div className="flex flex-wrap gap-2">
            {selectedCareers.map((career) => (
              <motion.div
                key={career.name}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {career.name}
                <button
                  onClick={() => handleCareerRemove(career)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  &times;
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {selectedCareers.length > 1 && (
        <Button onClick={toggleComparison} className="flex items-center mb-4">
          <GitCompareIcon className="mr-2" />
          {isComparing ? "Ocultar Comparación" : "Comparar Carreras Seleccionadas"}
        </Button>
      )}

      <AnimatePresence>
        {isComparing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <h2 className="text-2xl font-bold mb-4">Costos de Carreras</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart2 className="mr-2" />
                        Comparación de Costos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <RadarChart
                          data={selectedCareers.map((career) => ({
                            name: career.name,
                            value: getAverageFirstSemesterValue(career),
                          }))}
                        />
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2" />
                      Resumen de Carreras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No hay datos disponibles para comparar. Por favor, seleccione al menos dos carreras.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


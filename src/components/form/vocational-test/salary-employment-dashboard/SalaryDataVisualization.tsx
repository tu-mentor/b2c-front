
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bookmark,
  Briefcase,
  FileSearch,
  FlaskConical,
  GraduationCap,
  HardHat,
  Laptop,
  Leaf,
  Palette,
  Stethoscope,
  Users,
  Wrench,
} from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../shared/tooltip";
import {
  formatNumber,
  getColorForRange,
  getData,
  type GenderData,
  type SalaryRange,
} from "./dataProcessing";
import { Alert, AlertTitle, AlertDescription } from "../../../shared/alert";

interface SalaryDataVisualizationProps {
  careers: string[];
  gender: string;
}

export default function SalaryDataVisualization({ careers, gender }: SalaryDataVisualizationProps) {
  const data: GenderData = useMemo(() => getData(gender), [gender]);

  const getIconComponent = (fieldName: string) => {
    switch (fieldName) {
      case "Educación":
        return GraduationCap;
      case "Arte y Humanidades":
        return Palette;
      case "Ciencias Sociales, Periodismo e Información":
        return Users;
      case "Administración de Empresas y Derecho":
        return Briefcase;
      case "Ciencias Naturales, Matemáticas y Estadística":
        return FlaskConical;
      case "Tecnologías de la Información y la Comunicación (TIC)":
        return Laptop;
      case "Ingeniería, Industria y Construcción":
        return HardHat;
      case "Agropecuario, Silvicultura, Pesca y Veterinaria":
        return Leaf;
      case "Salud y Bienestar":
        return Stethoscope;
      case "Servicios":
        return Wrench;
      default:
        return Bookmark;
    }
  };

  const calculatePercentage = (range: SalaryRange, total: number): string => {
    const percentage = (range.total / total) * 100;
    return percentage.toFixed(1);
  };

  // Filtrar las carreras que tienen datos disponibles
  const availableCareers = careers.filter((fieldName) =>
    data.some((yearData) => yearData.fields.some((field) => field.name === fieldName))
  );

  // Verificar si no hay resultados para mostrar
  const noResults = availableCareers.length === 0;

  return (
    <div className="container mx-auto p-2 sm:p-4 overflow-x-hidden">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center text-gray-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Datos de Empleo y Salario por Carrera
      </motion.h1>
      <Alert variant="destructive" className="bg-card text-card-foreground w-full max-w-4xl mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription className="text-gray-500">
            SOFINSER, con la información de El Ministerio del Trabajo, agrupa nuestra "recomendación de
            carrera" en las siguientes categorías:
          </AlertDescription>
        </Alert>
      {noResults ? (
        <NoResultsMessage />
      ) : (
        <TooltipProvider delayDuration={0}>
          {availableCareers.map((fieldName) => {
            const IconComponent = getIconComponent(fieldName);
            const fieldData = data.flatMap((yearData) =>
              yearData.fields.filter((field) => field.name === fieldName)
            );

            return (
              <div key={fieldName} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <IconComponent className="w-8 h-8 mr-2 text-indigo-600" />
                  <span className="text-gray-500">{fieldName}</span>
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {fieldData.map((field, yearIndex) => {
                    const totalGraduates = field.salaryRanges.reduce(
                      (sum, range) => sum + range.total,
                      0
                    );

                    return (
                      <Card key={`${fieldName}-${yearIndex}`} className="w-full">
                        <CardHeader>
                          <CardTitle className="text-lg sm:text-xl text-gray-500">
                            Graduados {data[yearIndex].year - 1} - Vinculados {data[yearIndex].year}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4">
                          <div className="grid grid-cols-[1.5fr_2fr] gap-1 sm:gap-2 mb-1 sm:mb-2 font-semibold text-xs sm:text-sm text-gray-500">
                            <div>Salario Mínimo</div>
                            <div>Porcentaje Contratados</div>
                          </div>
                          {field.salaryRanges.map((range, rangeIndex) => {
                            const percentage = Number.parseFloat(
                              calculatePercentage(range, totalGraduates)
                            );
                            return (
                              <div
                                key={`${fieldName}-${yearIndex}-${range.range}`}
                                className="grid grid-cols-[1.5fr_2fr] gap-1 sm:gap-2 items-center mb-1 sm:mb-2 text-xs sm:text-sm"
                              >
                                <div className="text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                                  {range.range}
                                </div>
                                <div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="relative w-full">
                                        <motion.div
                                          className="h-4 sm:h-5 rounded-full bg-gray-200 relative overflow-hidden cursor-help w-full"
                                          initial={{ width: 0 }}
                                          animate={{ width: "100%" }}
                                          transition={{ duration: 1, delay: rangeIndex * 0.1 }}
                                        >
                                          <motion.div
                                            className={`h-full rounded-full ${getColorForRange(
                                              range.range
                                            )}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(percentage, 95)}%` }}
                                            transition={{ duration: 1, delay: rangeIndex * 0.1 }}
                                          />
                                        </motion.div>
                                        <div
                                          className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-[10px] sm:text-xs font-semibold px-1 rounded ${
                                            percentage > 90 ? "bg-white bg-opacity-75" : ""
                                          }`}
                                        >
                                          {percentage.toFixed(1)}%
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center" className="max-w-xs">
                                      <p>
                                        Graduados contratados en este rango salarial:{" "}
                                        {formatNumber(range.total)}
                                      </p>
                                      <p>Porcentaje: {percentage.toFixed(1)}%</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      )}
      <div className="text-sm text-gray-500 text-right mt-4">Fuente: SOFINSER</div>
    </div>
  );
}

function NoResultsMessage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 my-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 mb-6 text-indigo-500 opacity-80"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FileSearch className="w-full h-full" />
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
        {[GraduationCap, Laptop, Briefcase].map((Icon, index) => (
          <motion.div
            key={index}
            className="p-3 bg-gray-100 rounded-full"
            whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          >
            <Icon className="w-8 h-8 text-indigo-400" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

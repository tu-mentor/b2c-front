import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BarChartIcon, FileText, TrendingUp, GraduationCap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/tabs";
import { cn } from "../../../utils/utils";
import { PageContainer } from "@/components/shared/page-container";

import { getUserId } from "../../../../services/auth-service";
import { resultService } from "../../../../services/vocational-test/result-service";
import femaleData from "./salary-employment-data-f.json";
import maleData from "./salary-employment-data-m.json";

const colorPalette = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F06292",
  "#AED581",
  "#7986CB",
  "#9575CD",
  "#4DB6AC",
];

const tabStyles = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
  default: "bg-muted text-muted-foreground hover:bg-muted/80",
  active: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
};

type SalaryRange = {
  range: string;
  total: number;
};

type FieldData = {
  name: string;
  salaryRanges: SalaryRange[];
};

type YearData = {
  year: number;
  fields: FieldData[];
};

type Props = {
  gender: string;
  recomendedCarrers: string[];
};

const getSalaryValue = (range: string): number => {
  const parts = range.split(" ");
  if (parts[0] === "Más") return 9;
  if (parts[0] === "Entre") {
    return (parseFloat(parts[1]) + parseFloat(parts[3])) / 2;
  }
  return parseFloat(parts[0]);
};

export default function SalaryEmploymentDashboard({ gender, recomendedCarrers = [] }: Props) {
  const [data, setData] = useState<YearData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [activeTab, setActiveTab] = useState<string>("distribution");
  const [userResult, setUserResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [missingCareers, setMissingCareers] = useState<string[]>([]);

  useEffect(() => {
    const newData = gender === "0" ? femaleData : maleData;
    setData(newData);

    const availableCareers = new Set(newData[0]?.fields.map((field) => field.name));
    const missing = recomendedCarrers.filter((career) => !availableCareers.has(career));
    setMissingCareers(missing);
  }, [gender, recomendedCarrers]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await resultService.getResults(getUserId());
        if (response && response.userResult) {
          setUserResult(response.userResult);
        } else {
          setError("Unexpected data format. Please try again later.");
        }
      } catch (err) {
        setError("Failed to fetch results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredData =
    data
      .find((yearData) => yearData.year === selectedYear)
      ?.fields.filter((field) => recomendedCarrers.includes(field.name)) || [];

  const chartData = filteredData
    .flatMap((field) =>
      field.salaryRanges.map((range) => ({
        range: range.range,
        [field.name]: range.total,
      }))
    )
    .reduce((acc, curr) => {
      const existingRange = acc.find((item) => item.range === curr.range);
      if (existingRange) {
        return acc.map((item) => (item.range === curr.range ? { ...item, ...curr } : item));
      }
      return [...acc, curr];
    }, [] as Record<string, number | string>[]);

  const totalEmployees = filteredData.reduce(
    (acc, field) => acc + field.salaryRanges.reduce((sum, range) => sum + range.total, 0),
    0
  );

  const pieChartData = filteredData.map((field) => ({
    name: field.name,
    value: field.salaryRanges.reduce((sum, range) => sum + range.total, 0),
  }));

  const trendData = data.map((yearData) => ({
    year: yearData.year,
    ...recomendedCarrers.reduce((acc, field) => {
      const fieldData = yearData.fields.find((f) => f.name === field);
      acc[field] = fieldData?.salaryRanges.reduce((sum, range) => sum + range.total, 0) || 0;
      return acc;
    }, {} as Record<string, number>),
  }));

  const summaryData = useMemo(() => {
    const allFields = data[0]?.fields.map((field) => field.name) || [];
    return allFields
      .map((fieldName) => {
        const fieldData = data.map((yearData) => {
          const field = yearData.fields.find((f) => f.name === fieldName);
          const totalEmployees =
            field?.salaryRanges.reduce((sum, range) => sum + range.total, 0) || 0;
          const weightedSalary =
            field?.salaryRanges.reduce((sum, range) => {
              const salaryValue = getSalaryValue(range.range);
              return sum + salaryValue * range.total;
            }, 0) || 0;
          const averageSalary = totalEmployees > 0 ? weightedSalary / totalEmployees : 0;
          return { year: yearData.year, totalEmployees, averageSalary };
        });

        const growthRate =
          (fieldData[fieldData.length - 1].totalEmployees - fieldData[0].totalEmployees) /
          fieldData[0].totalEmployees;
        const averageSalary = fieldData[fieldData.length - 1].averageSalary;

        return {
          name: fieldName,
          growthRate,
          averageSalary,
        };
      })
      .sort((a, b) => b.growthRate - a.growthRate);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const NoDataDisplay = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="text-yellow-500 w-16 h-16 mb-4" />
      <p className="text-lg font-semibold">No hay datos disponibles para la selección actual.</p>
    </div>
  );

  const MissingCareersAlert = ({ careers }: { careers: string[] }) => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
      <p className="font-bold">Atención</p>
      <p>
        La información de las siguientes carreras no se encuentra dentro de las clasificaciones de
        históricos.
      </p>
      <ul className="list-disc list-inside">
        {careers.map((career) => (
          <li key={career}>{career}</li>
        ))}
      </ul>
    </div>
  );

  const breadcrumbItems = [
    {
      label: "Orientación Vocacional",
      href: "/vocational-guidance",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Dashboard de Salarios y Empleo",
      icon: <BarChart className="h-4 w-4" />,
    },
  ];

  return (
    <PageContainer
      title="Dashboard de Salarios y Empleo"
      description="Explora las tendencias de salarios y empleo para diferentes carreras profesionales."
      breadcrumbItems={breadcrumbItems}
      icon={<BarChart className="h-6 w-6" />}
    >
      {missingCareers.length > 0 && <MissingCareersAlert careers={missingCareers} />}
      {data.length === 0 && <NoDataDisplay />}
      <Card className="w-full border-0">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center mb-6 text-primary">
            Tablero de Salarios y Empleo
          </CardTitle>
          <CardDescription className="mt-2 text-sm">
            Esta es la información relacionada de salarios y empleos para las carreras sugeridas
            para el hijo seleccionado actualmente. Esta información hisotrórica es obtenida desdel
            ministerio de Educación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger
                value="distribution"
                className={cn(
                  tabStyles.base,
                  activeTab === "distribution" ? tabStyles.active : tabStyles.default
                )}
              >
                <BarChartIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Distribución</span>
                <span className="sm:hidden">Dist.</span>
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className={cn(
                  tabStyles.base,
                  activeTab === "trends" ? tabStyles.active : tabStyles.default
                )}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Tendencias</span>
                <span className="sm:hidden">Tend.</span>
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className={cn(
                  tabStyles.base,
                  activeTab === "summary" ? tabStyles.active : tabStyles.default
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Resumen</span>
                <span className="sm:hidden">Res.</span>
              </TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <TabsContent value="distribution" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución de Salarios</CardTitle>
                        <CardDescription className="mt-2">
                          Este gráfico muestra la distribución de salarios por rango para los campos
                          seleccionados, permitiendo comparar las diferencias salariales entre
                          sectores.
                          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <Select
                              value={selectedYear.toString()}
                              onValueChange={(value) => setSelectedYear(Number(value))}
                            >
                              <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Seleccionar año" />
                              </SelectTrigger>
                              <SelectContent>
                                {data.map((yearData) => (
                                  <SelectItem key={yearData.year} value={yearData.year.toString()}>
                                    {yearData.year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {/*             <div className="flex items-center space-x-2">
              <Users className="text-blue-500" />
              <span className="font-semibold">Total de Empleados: {totalEmployees}</span>
            </div> */}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] sm:h-[400px]">
                        {chartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <XAxis dataKey="range" />
                              <YAxis
                                label={{
                                  value: "Número de empleados",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              {recomendedCarrers.map((field, index) => (
                                <Bar
                                  key={field}
                                  dataKey={field}
                                  fill={colorPalette[index % colorPalette.length]}
                                />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <NoDataDisplay />
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Comparación de Campos</CardTitle>
                        <CardDescription className="mt-2">
                          Este gráfico circular representa la proporción de empleados en cada campo
                          seleccionado, ofreciendo una visión general de la distribución laboral.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] sm:h-[400px]">
                        {pieChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                label
                              >
                                {pieChartData.map((_, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={colorPalette[index % colorPalette.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <NoDataDisplay />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="trends" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tendencias de Empleo</CardTitle>
                        <CardDescription className="mt-2">
                          Este gráfico de líneas muestra la evolución del empleo a lo largo del
                          tiempo para los campos seleccionados, permitiendo identificar tendencias
                          de crecimiento o declive.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] sm:h-[400px]">
                        {trendData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                              <XAxis dataKey="year" />
                              <YAxis
                                label={{
                                  value: "Número de empleados",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              {recomendedCarrers.map((field, index) => (
                                <Line
                                  key={field}
                                  type="monotone"
                                  dataKey={field}
                                  stroke={colorPalette[index % colorPalette.length]}
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 8 }}
                                />
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <NoDataDisplay />
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución por Año</CardTitle>
                        <CardDescription className="mt-2">
                          Este gráfico de barras compara la cantidad de empleados por campo para
                          cada año, facilitando la visualización de cambios en la distribución
                          laboral a lo largo del tiempo.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] sm:h-[400px]">
                        {trendData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                              <XAxis dataKey="year" />
                              <YAxis
                                label={{
                                  value: "Número de empleados",
                                  angle: -90,
                                  position: "insideLeft",
                                }}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend />
                              {recomendedCarrers.map((field, index) => (
                                <Bar
                                  key={field}
                                  dataKey={field}
                                  fill={colorPalette[index % colorPalette.length]}
                                />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <NoDataDisplay />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="summary" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Campos con Mayor Tasa de Crecimiento</CardTitle>
                        <CardDescription className="mt-2">
                          Este gráfico muestra los campos que han experimentado el mayor crecimiento
                          en términos de empleo, indicando las áreas con mayor expansión laboral.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] sm:h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={summaryData.slice(0, 5)} layout="vertical">
                            <XAxis
                              type="number"
                              tickFormatter={(value) => `${(value * 100).toFixed(2)}%`}
                            />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip
                              formatter={(value) =>
                                `Tasa de crecimiento: ${(Number(value) * 100).toFixed(2)}%`
                              }
                            />
                            <Bar dataKey="growthRate" fill="#4ECDC4">
                              {summaryData.slice(0, 5).map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={colorPalette[index % colorPalette.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Campos con Salarios Promedio Más Altos</CardTitle>
                        <CardDescription className="mt-2">
                          Este gráfico presenta los campos con los salarios promedio más altos,
                          medidos en Salarios Mínimos Mensuales Legales Vigentes (SMMLV), mostrando
                          las áreas mejor remuneradas.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] sm:h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[...summaryData]
                              .sort((a, b) => b.averageSalary - a.averageSalary)
                              .slice(0, 5)}
                            layout="vertical"
                          >
                            <XAxis
                              type="number"
                              tickFormatter={(value) => `${value.toFixed(2)} SMMLV`}
                            />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip
                              formatter={(value) =>
                                `Salario promedio: ${Number(value).toFixed(2)} SMMLV`
                              }
                            />
                            <Bar dataKey="averageSalary" fill="#FF6B6B">
                              {[...summaryData]
                                .sort((a, b) => b.averageSalary - a.averageSalary)
                                .slice(0, 5)
                                .map((_, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={colorPalette[index % colorPalette.length]}
                                  />
                                ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

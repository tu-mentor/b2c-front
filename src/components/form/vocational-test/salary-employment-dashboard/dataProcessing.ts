import maleData from "./salary-employment-data-m.json";
import femaleData from "./salary-employment-data-f.json";

export type SalaryRange = {
  range: string;
  total: number;
};

export type SalaryField = {
  name: string;
  salaryRanges: SalaryRange[];
};

export type YearData = {
  year: number;
  fields: SalaryField[];
};

export type GenderData = YearData[];

export const getData = (gender: string): GenderData => {
  return gender === "1" ? maleData : femaleData;
};

export const getLatestYear = (data: GenderData): number => {
  return Math.max(...data.map((yearData) => yearData.year));
};

export const getColorForRange = (range: string): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const index = [
    "1",
    "Entre 1 y 1,5",
    "Entre 1,5 y 2,5",
    "Entre 2,5 y 4",
    "Entre 4 y 6",
    "Entre 6 y 9",
    "Más de 9",
  ].indexOf(range);
  return colors[index] || "bg-gray-500";
};

export const getIconForField = (fieldName: string) => {
  const icons: { [key: string]: string } = {
    Educación: "GraduationCap",
    "Arte y Humanidades": "Palette",
    "Ciencias Sociales, Periodismo e Información": "Users",
    "Administración de Empresas y Derecho": "Briefcase",
    "Ciencias Naturales, Matemáticas y Estadística": "FlaskConical",
    "Tecnologías de la Información y la Comunicación (TIC)": "Laptop",
    "Ingeniería, Industria y Construcción": "HardHat",
    "Agropecuario, Silvicultura, Pesca y Veterinaria": "Leaf",
    "Salud y Bienestar": "Stethoscope",
    Servicios: "Wrench",
  };
  return icons[fieldName] || "Bookmark";
};

export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

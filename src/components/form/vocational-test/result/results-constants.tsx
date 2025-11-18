import { ChasideScores, HollandScores } from "../types/results-types";

export const hollandColors = {
  realistic: "rgba(255, 99, 132, 0.7)",
  investigative: "rgba(54, 162, 235, 0.7)",
  artistic: "rgba(255, 206, 86, 0.7)",
  social: "rgba(75, 192, 192, 0.7)",
  enterprising: "rgba(153, 102, 255, 0.7)",
  conventional: "rgba(255, 159, 64, 0.7)",
};

export const chasideColors = {
  C: "rgba(255, 99, 132, 0.7)",
  H: "rgba(54, 162, 235, 0.7)",
  A: "rgba(255, 206, 86, 0.7)",
  S: "rgba(75, 192, 192, 0.7)",
  I: "rgba(153, 102, 255, 0.7)",
  D: "rgba(255, 159, 64, 0.7)",
  E: "rgba(201, 203, 207, 0.7)",
};

export const hollandLabels: Record<keyof HollandScores, string> = {
  realistic: "Realista",
  investigative: "Investigativo",
  artistic: "Artístico",
  social: "Social",
  enterprising: "Emprendedor",
  conventional: "Convencional",
};

export const chasideLabels: Record<keyof ChasideScores, string> = {
  C: "Administrativo",
  H: "Humanístico",
  A: "Artístico",
  S: "Social",
  I: "Investigativo",
  D: "Destreza Manual",
  E: "Exacto",
};

export const hollandDescriptions: Record<keyof HollandScores, string> = {
  realistic: "Prefiere trabajar con objetos, herramientas y máquinas.",
  investigative: "Disfruta resolviendo problemas abstractos y entendiendo el mundo físico.",
  artistic: "Valora la auto-expresión creativa y prefiere trabajar en entornos no estructurados.",
  social: "Le gusta trabajar con personas, ayudar o enseñar a otros.",
  enterprising: "Disfruta liderando, persuadiendo y tomando riesgos.",
  conventional: "Prefiere trabajar con datos, detalles y siguiendo procedimientos establecidos.",
};

export const chasideDescriptions: Record<keyof ChasideScores, string> = {
  C: "Habilidades administrativas y de organización.",
  H: "Interés en las ciencias humanas y sociales.",
  A: "Inclinación hacia actividades artísticas y creativas.",
  S: "Preferencia por el trabajo social y comunitario.",
  I: "Interés en la investigación y el análisis.",
  D: "Habilidades manuales y técnicas.",
  E: "Precisión y atención al detalle.",
};

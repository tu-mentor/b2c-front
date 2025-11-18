import {
  Apple,
  Award,
  Book,
  Brain,
  Briefcase,
  Calculator,
  Clock,
  Cloud,
  Compass,
  Crosshair,
  Eye,
  Feather,
  Fingerprint,
  Hammer,
  Heart,
  Laptop,
  Lightbulb,
  Microscope,
  Mountain,
  Music,
  Palette,
  Rocket,
  Ruler,
  Scale,
  Shield,
  Stethoscope,
  Target,
  Telescope,
  TestTube,
  Thermometer,
  UserCheck,
  Users,
  Wrench,
  Zap
} from "lucide-react";
import { PersonalityType } from "./chaside-data";

export const personalityIcons: Record<PersonalityType, React.ReactNode> = {
  C: <Calculator className="h-6 w-6" />,
  H: <Heart className="h-6 w-6" />,
  A: <Palette className="h-6 w-6" />,
  S: <Briefcase className="h-6 w-6" />,
  I: <Microscope className="h-6 w-6" />,
  D: <Shield className="h-6 w-6" />,
  E: <Lightbulb className="h-6 w-6" />,
};

export const personalityMeanings: Record<PersonalityType, string> = {
  C: "Constructivo",
  H: "Humanitario",
  A: "Artístico",
  S: "Salud y Social",
  I: "Investigativo",
  D: "Defensivo",
  E: "Experimental",
};

export const personalityDescriptions: Record<PersonalityType, string> = {
  C: "Aptitudes administrativas y de cálculo.",
  H: "Interés por las humanidades y ciencias sociales.",
  A: "Habilidades artísticas y creativas.",
  S: "Aptitudes para las ciencias de la salud.",
  I: "Interés por las enseñanzas técnicas e ingeniería.",
  D: "Habilidades para la defensa y seguridad.",
  E: "Aptitudes para las ciencias experimentales (campo de estudio que se basa en la realización de experimentos para comprobar fenómenos y teorías).",
};

export const personalityDetails: Record<
  PersonalityType,
  {
    characteristics: { text: string; icon: React.ReactNode }[];
    skills: { text: string; icon: React.ReactNode }[];
    careers: { text: string; icon: React.ReactNode }[];
  }
> = {
  C: {
    characteristics: [
      { text: "Organización", icon: <Briefcase className="h-5 w-5" /> },
      { text: "Supervisión", icon: <Eye className="h-5 w-5" /> },
      { text: "Orden", icon: <Ruler className="h-5 w-5" /> },
      { text: "Análisis y síntesis", icon: <Brain className="h-5 w-5" /> },
      { text: "Colaboración", icon: <Users className="h-5 w-5" /> },
      { text: "Cálculo", icon: <Calculator className="h-5 w-5" /> },
    ],
    skills: [
      { text: "Persuasión", icon: <UserCheck className="h-5 w-5" /> },
      { text: "Objetividad", icon: <Target className="h-5 w-5" /> },
      { text: "Practicidad", icon: <Hammer className="h-5 w-5" /> },
      { text: "Tolerancia", icon: <Heart className="h-5 w-5" /> },
      { text: "Responsabilidad", icon: <Clock className="h-5 w-5" /> },
      { text: "Ambición", icon: <Rocket className="h-5 w-5" /> },
    ],
    careers: [
      { text: "Administración de Empresas", icon: <Briefcase className="h-5 w-5" /> },
      { text: "Contabilidad", icon: <Calculator className="h-5 w-5" /> },
      { text: "Economía", icon: <Lightbulb className="h-5 w-5" /> },
      { text: "Finanzas", icon: <Zap className="h-5 w-5" /> },
      { text: "Gestión de Recursos Humanos", icon: <Users className="h-5 w-5" /> },
    ],
  },
  H: {
    characteristics: [
      { text: "Precisión Verbal", icon: <Feather className="h-5 w-5" /> },
      { text: "Organización", icon: <Briefcase className="h-5 w-5" /> },
      { text: "Relación de hechos", icon: <Compass className="h-5 w-5" /> },
      { text: "Lingüística", icon: <Book className="h-5 w-5" /> },
      { text: "Orden", icon: <Ruler className="h-5 w-5" /> },
      { text: "Justicia", icon: <Scale className="h-5 w-5" /> },
    ],
    skills: [
      { text: "Responsabilidad", icon: <Clock className="h-5 w-5" /> },
      { text: "Justicia", icon: <Scale className="h-5 w-5" /> },
      { text: "Conciliación", icon: <UserCheck className="h-5 w-5" /> },
      { text: "Persuasión", icon: <Users className="h-5 w-5" /> },
      { text: "Sagacidad", icon: <Eye className="h-5 w-5" /> },
      { text: "Imaginación", icon: <Lightbulb className="h-5 w-5" /> },
    ],
    careers: [
      { text: "Derecho", icon: <Scale className="h-5 w-5" /> },
      { text: "Psicología", icon: <Brain className="h-5 w-5" /> },
      { text: "Sociología", icon: <Users className="h-5 w-5" /> },
      { text: "Trabajo Social", icon: <Heart className="h-5 w-5" /> },
      { text: "Filosofía", icon: <Book className="h-5 w-5" /> },
      { text: "Historia", icon: <Compass className="h-5 w-5" /> },
    ],
  },
  A: {
    characteristics: [
      { text: "Estética", icon: <Palette className="h-5 w-5" /> },
      { text: "Armonía", icon: <Music className="h-5 w-5" /> },
      { text: "Habilidad manual", icon: <Hammer className="h-5 w-5" /> },
      { text: "Percepción visual", icon: <Eye className="h-5 w-5" /> },
      { text: "Percepción auditiva", icon: <Music className="h-5 w-5" /> },
      { text: "Sensibilidad", icon: <Heart className="h-5 w-5" /> },
    ],
    skills: [
      { text: "Imaginación", icon: <Lightbulb className="h-5 w-5" /> },
      { text: "Creatividad", icon: <Palette className="h-5 w-5" /> },
      { text: "Atención al detalle", icon: <Eye className="h-5 w-5" /> },
      { text: "Innovación", icon: <Zap className="h-5 w-5" /> },
      { text: "Intuición", icon: <Brain className="h-5 w-5" /> },
    ],
    careers: [
      { text: "Bellas Artes", icon: <Palette className="h-5 w-5" /> },
      { text: "Diseño Gráfico", icon: <Palette className="h-5 w-5" /> },
      { text: "Arquitectura", icon: <Ruler className="h-5 w-5" /> },
      { text: "Música", icon: <Music className="h-5 w-5" /> },
      { text: "Teatro", icon: <Users className="h-5 w-5" /> },
      { text: "Cine", icon: <Eye className="h-5 w-5" /> },
    ],
  },
  S: {
    characteristics: [
      { text: "Asistencia", icon: <Heart className="h-5 w-5" /> },
      { text: "Investigación", icon: <Microscope className="h-5 w-5" /> },
      { text: "Precisión", icon: <Target className="h-5 w-5" /> },
      { text: "Percepción", icon: <Eye className="h-5 w-5" /> },
      { text: "Análisis", icon: <Brain className="h-5 w-5" /> },
      { text: "Ayuda", icon: <UserCheck className="h-5 w-5" /> },
    ],
    skills: [
      { text: "Altruismo", icon: <Heart className="h-5 w-5" /> },
      { text: "Solidaridad", icon: <Users className="h-5 w-5" /> },
      { text: "Paciencia", icon: <Clock className="h-5 w-5" /> },
      { text: "Comprensión", icon: <Brain className="h-5 w-5" /> },
      { text: "Respeto", icon: <UserCheck className="h-5 w-5" /> },
      { text: "Persuasión", icon: <Users className="h-5 w-5" /> },
    ],
    careers: [
      { text: "Medicina", icon: <Stethoscope className="h-5 w-5" /> },
      { text: "Enfermería", icon: <Heart className="h-5 w-5" /> },
      { text: "Odontología", icon: <Stethoscope className="h-5 w-5" /> },
      { text: "Fisioterapia", icon: <UserCheck className="h-5 w-5" /> },
      { text: "Nutrición", icon: <Apple className="h-5 w-5" /> },
      { text: "Farmacia", icon: <Thermometer className="h-5 w-5" /> },
    ],
  },
  I: {
    characteristics: [
      { text: "Cálculo", icon: <Calculator className="h-5 w-5" /> },
      { text: "Científico", icon: <Microscope className="h-5 w-5" /> },
      { text: "Habilidad manual", icon: <Hammer className="h-5 w-5" /> },
      { text: "Exactitud", icon: <Target className="h-5 w-5" /> },
      { text: "Planificación", icon: <Compass className="h-5 w-5" /> },
      { text: "Precisión", icon: <Ruler className="h-5 w-5" /> },
    ],
    skills: [
      { text: "Practicidad", icon: <Hammer className="h-5 w-5" /> },
      { text: "Crítica", icon: <Eye className="h-5 w-5" /> },
      { text: "Análisis", icon: <Brain className="h-5 w-5" /> },
      { text: "Rigurosidad", icon: <Target className="h-5 w-5" /> },
    ],
    careers: [
      { text: "Ingeniería", icon: <Wrench className="h-5 w-5" /> },
      { text: "Informática", icon: <Laptop className="h-5 w-5" /> },
      { text: "Matemáticas", icon: <Calculator className="h-5 w-5" /> },
      { text: "Física", icon: <Zap className="h-5 w-5" /> },
      { text: "Química", icon: <TestTube className="h-5 w-5" /> },
      { text: "Biotecnología", icon: <Microscope className="h-5 w-5" /> },
    ],
  },
  D: {
    characteristics: [
      { text: "Justicia", icon: <Scale className="h-5 w-5" /> },
      { text: "Equidad", icon: <UserCheck className="h-5 w-5" /> },
      { text: "Colaboración", icon: <Users className="h-5 w-5" /> },
      { text: "Espíritu de equipo", icon: <Users className="h-5 w-5" /> },
      { text: "Liderazgo", icon: <Award className="h-5 w-5" /> },
    ],
    skills: [
      { text: "Arrojo", icon: <Zap className="h-5 w-5" /> },
      { text: "Solidaridad", icon: <Heart className="h-5 w-5" /> },
      { text: "Valentía", icon: <Shield className="h-5 w-5" /> },
      { text: "Asertividad", icon: <UserCheck className="h-5 w-5" /> },
      { text: "Persuasión", icon: <Users className="h-5 w-5" /> },
    ],
    careers: [
      { text: "Criminología", icon: <Fingerprint className="h-5 w-5" /> },
      { text: "Seguridad Pública", icon: <Shield className="h-5 w-5" /> },
      { text: "Ciencias Militares", icon: <Crosshair className="h-5 w-5" /> },
      { text: "Derecho Penal", icon: <Scale className="h-5 w-5" /> },
      { text: "Protección Civil", icon: <Users className="h-5 w-5" /> },
    ],
  },
  E: {
    characteristics: [
      { text: "Investigación", icon: <Microscope className="h-5 w-5" /> },
      { text: "Orden", icon: <Ruler className="h-5 w-5" /> },
      { text: "Organización", icon: <Briefcase className="h-5 w-5" /> },
      { text: "Análisis y Síntesis", icon: <Brain className="h-5 w-5" /> },
      { text: "Cálculo numérico", icon: <Calculator className="h-5 w-5" /> },
      { text: "Clasificación", icon: <Compass className="h-5 w-5" /> },
    ],
    skills: [
      { text: "Metodicidad", icon: <Compass className="h-5 w-5" /> },
      { text: "Análisis", icon: <Brain className="h-5 w-5" /> },
      { text: "Observación", icon: <Eye className="h-5 w-5" /> },
      { text: "Introversión", icon: <UserCheck className="h-5 w-5" /> },
      { text: "Paciencia", icon: <Clock className="h-5 w-5" /> },
      { text: "Seguridad", icon: <Shield className="h-5 w-5" /> },
    ],
    careers: [
      { text: "Biología", icon: <Microscope className="h-5 w-5" /> },
      { text: "Geología", icon: <Mountain className="h-5 w-5" /> },
      { text: "Química", icon: <TestTube className="h-5 w-5" /> },
      { text: "Física", icon: <Zap className="h-5 w-5" /> },
      { text: "Astronomía", icon: <Telescope className="h-5 w-5" /> },
      { text: "Meteorología", icon: <Cloud className="h-5 w-5" /> },
    ],
  },
};

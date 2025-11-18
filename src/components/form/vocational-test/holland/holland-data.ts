export type PersonalityType =
  | "Realista"
  | "Investigador"
  | "Artístico"
  | "Social"
  | "Emprendedor"
  | "Convencional";

export type Question = {
  text: string;
  type: PersonalityType;
};

export type PreferenceQuestion = {
  text: string;
  category: string;
};

export type Career = {
  name: string;
  profile: Record<PersonalityType, number>;
  description: string;
  skills: string[];
  jobOutlook: string;
};

export const questions: Question[] = [
  // Realista
  { text: "Me gusta trabajar con mis manos (ej: carpintería, jardinería, manualidades)", type: "Realista" },
  { text: "Me gusta seguir instrucciones paso a paso (ej: manuales, recetas, protocolos)", type: "Realista" },
  { text: "Me gusta arreglar cosas (ej: electrodomésticos, bicicletas, muebles)", type: "Realista" },
  { text: "Me gusta resolver problemas prácticos (ej: cómo arreglar algo que se rompió)", type: "Realista" },
  { text: "Me gusta trabajar con máquinas y herramientas (ej: taladros, sierras, computadoras)", type: "Realista" },
  { text: "Me gusta tener reglas claras (ej: procedimientos, normas, estándares)", type: "Realista" },
  { text: "Me gusta trabajos que requieran fuerza física (ej: construcción, agricultura, deportes)", type: "Realista" },
  { text: "Me gusta construir cosas (ej: modelos, muebles, estructuras)", type: "Realista" },
  { text: "Me gusta trabajos que requieran habilidades técnicas (ej: mecánica, electricidad, programación)", type: "Realista" },

  // Investigador
  { text: "Me gusta analizar información (ej: datos, estadísticas, reportes)", type: "Investigador" },
  { text: "Me gusta investigar temas a fondo (ej: leer artículos científicos, hacer experimentos)", type: "Investigador" },
  { text: "Me gusta trabajar solo (ej: concentrarme sin interrupciones)", type: "Investigador" },
  { text: "Me gusta resolver problemas difíciles (ej: puzzles complejos, enigmas)", type: "Investigador" },
  { text: "Me gusta encontrar explicaciones a las cosas (ej: por qué suceden los fenómenos)", type: "Investigador" },
  { text: "Me gusta usar la lógica (ej: razonamiento deductivo, análisis crítico)", type: "Investigador" },
  { text: "Me gusta descubrir cosas nuevas (ej: explorar teorías, investigar fenómenos)", type: "Investigador" },
  { text: "Me gusta resolver problemas matemáticos (ej: ecuaciones, cálculos complejos)", type: "Investigador" },
  { text: "Me gusta analizar antes de actuar (ej: estudiar todas las opciones)", type: "Investigador" },

  // Artístico
  { text: "Me gusta crear cosas originales (ej: arte, música, escritura)", type: "Artístico" },
  { text: "Me gusta trabajos que me permitan ser creativo (ej: diseño, publicidad, arte)", type: "Artístico" },
  { text: "Me gusta expresarme de forma artística (ej: pintar, cantar, bailar)", type: "Artístico" },
  { text: "Me gusta trabajar con colores (ej: pintura, diseño gráfico, decoración)", type: "Artístico" },
  { text: "Me gusta crear historias o narrativas (ej: escribir cuentos, guiones, poesía)", type: "Artístico" },
  { text: "Me gusta usar la imaginación (ej: inventar mundos, personajes, ideas)", type: "Artístico" },
  { text: "Me gusta crear diseños visuales atractivos (ej: logos, carteles, páginas web)", type: "Artístico" },
  { text: "Me gusta experimentar con diferentes formas (ej: escultura, arquitectura, moda)", type: "Artístico" },
  { text: "Me gusta trabajos que valoren la belleza (ej: arte, moda, diseño)", type: "Artístico" },

  // Social
  { text: "Me gusta trabajar con personas (ej: atención al cliente, ventas, servicios)", type: "Social" },
  { text: "Me gusta trabajos que requieran hablar mucho (ej: profesor, vendedor, terapeuta)", type: "Social" },
  { text: "Me gusta ayudar a otros (ej: voluntariado, trabajo social, enfermería)", type: "Social" },
  { text: "Me gusta enseñar (ej: profesor, entrenador, mentor)", type: "Social" },
  { text: "Me gusta resolver problemas de personas (ej: psicología, trabajo social, mediación)", type: "Social" },
  { text: "Me gusta entender emociones (ej: psicología, consejería, coaching)", type: "Social" },
  { text: "Me gusta motivar a otros (ej: líder de equipo, entrenador, mentor)", type: "Social" },
  { text: "Me gusta trabajar en equipo (ej: proyectos colaborativos, grupos de trabajo)", type: "Social" },
  { text: "Me gusta resolver conflictos entre personas (ej: mediación, recursos humanos, psicología)", type: "Social" },

  // Emprendedor
  { text: "Me gusta liderar (ej: dirigir equipos, ser jefe de proyecto)", type: "Emprendedor" },
  { text: "Me gusta tomar decisiones (ej: elegir estrategias, resolver problemas empresariales)", type: "Emprendedor" },
  { text: "Me gusta asumir riesgos (ej: invertir dinero, iniciar negocios)", type: "Emprendedor" },
  { text: "Me gusta convencer a otros (ej: ventas, marketing, política)", type: "Emprendedor" },
  { text: "Me gusta crear estrategias (ej: planificación empresarial, marketing)", type: "Emprendedor" },
  { text: "Me gusta tener iniciativa propia (ej: emprender, crear proyectos)", type: "Emprendedor" },
  { text: "Me gusta enfocarme en resultados (ej: alcanzar metas, cumplir objetivos)", type: "Emprendedor" },
  { text: "Me gusta negociar (ej: acuerdos comerciales, contratos)", type: "Emprendedor" },
  { text: "Me gusta vender ideas o productos (ej: ventas, publicidad, emprendimiento)", type: "Emprendedor" },

  // Convencional
  { text: "Me gusta organizar información (ej: bases de datos, archivos, documentos)", type: "Convencional" },
  { text: "Me gusta trabajos que requieran exactitud (ej: contabilidad, auditoría, facturación)", type: "Convencional" },
  { text: "Me gusta seguir procedimientos (ej: protocolos, manuales, reglas)", type: "Convencional" },
  { text: "Me gusta trabajar con números (ej: contabilidad, estadísticas, finanzas)", type: "Convencional" },
  { text: "Me gusta mantener archivos organizados (ej: secretaría, administración, bibliotecas)", type: "Convencional" },
  { text: "Me gusta atención al detalle (ej: revisión de documentos, control de calidad)", type: "Convencional" },
  { text: "Me gusta procesos ordenados (ej: logística, administración, gestión)", type: "Convencional" },
  { text: "Me gusta documentar información (ej: secretaría, archivo, documentación)", type: "Convencional" },
  { text: "Me gusta seguir rutinas (ej: horarios fijos, procesos repetitivos)", type: "Convencional" },

  // Preguntas sutiles sobre preferencias académicas (equilibradas - 1 por tipo)
  { text: "Me gusta usar computadoras y tecnología (ej: programación, diseño web, sistemas)", type: "Realista" },
  { text: "Me gusta leer libros técnicos (ej: manuales, textos científicos, documentación)", type: "Investigador" },
  { text: "Me gusta dibujar y diseñar (ej: ilustración, diseño gráfico, bocetos)", type: "Artístico" },
  { text: "Me gusta aprender idiomas (ej: inglés, francés, comunicación intercultural)", type: "Social" },
  { text: "Me gusta los juegos de estrategia (ej: ajedrez, videojuegos tácticos, planificación)", type: "Emprendedor" },
  { text: "Me gusta planificar y organizar (ej: eventos, proyectos, horarios)", type: "Convencional" },
]

export const careers: Career[] = [
  {
    name: "Ingeniero Mecánico",
    profile: {
      Realista: 5,
      Investigador: 4,
      Convencional: 3,
      Artístico: 1,
      Social: 2,
      Emprendedor: 2,

    },
    description:
      "Diseña, desarrolla y prueba dispositivos mecánicos, incluyendo herramientas, motores y máquinas.",
    skills: ["Resolución de problemas", "Diseño CAD", "Análisis de datos", "Gestión de proyectos"],
    jobOutlook:
      "Se proyecta un crecimiento del 7.8% en la demanda de ingenieros mecánicos en Colombia para el período 2020-2024.",
  },
  {
    name: "Científico de Datos",
    profile: {
      Investigador: 5,
      Convencional: 3,
      Realista: 2,
      Artístico: 1,
      Social: 2,
      Emprendedor: 3,
    },
    description:
      "Analiza datos complejos para ayudar a las organizaciones a tomar decisiones informadas.",
    skills: ["Programación", "Estadística", "Aprendizaje automático", "Visualización de datos"],
    jobOutlook:
      "Se espera un crecimiento del 30% en la demanda de científicos de datos en Colombia para el año 2025.",
  },
  {
    name: "Diseñador Gráfico",
    profile: {
      Artístico: 5,
      Emprendedor: 3,
      Social: 2,
      Realista: 1,
      Investigador: 2,
      Convencional: 1,
    },
    description:
      "Crea elementos visuales como logotipos, diseños y gráficos para transmitir ideas que inspiran e informan.",
    skills: ["Adobe Creative Suite", "Diseño de UI/UX", "Tipografía", "Branding"],
    jobOutlook:
      "Se proyecta un crecimiento del 5% en la demanda de diseñadores gráficos en Colombia para el período 2020-2025.",
  },
  {
    name: "Psicólogo",
    profile: {
      Social: 5,
      Investigador: 4,
      Artístico: 3,
      Realista: 1,
      Emprendedor: 2,
      Convencional: 2,
    },
    description:
      "Estudia el comportamiento y los procesos mentales para ayudar a las personas a superar problemas y tomar decisiones.",
    skills: ["Empatía", "Análisis", "Comunicación", "Resolución de problemas"],
    jobOutlook:
      "Se espera un crecimiento del 10% en la demanda de psicólogos en Colombia para el período 2020-2025.",
  },
  {
    name: "Emprendedor",
    profile: {
      Emprendedor: 5,
      Social: 3,
      Convencional: 2,
      Realista: 2,
      Investigador: 3,
      Artístico: 2,
    },
    description:
      "Inicia y gestiona su propio negocio, asumiendo riesgos financieros con la esperanza de obtener ganancias.",
    skills: ["Liderazgo", "Toma de decisiones", "Gestión financiera", "Networking"],
    jobOutlook:
      "El ecosistema emprendedor en Colombia ha crecido un 321.3% en los últimos 10 años, con perspectivas positivas para el futuro.",
  },
  {
    name: "Contador",
    profile: {
      Convencional: 5,
      Emprendedor: 3,
      Realista: 2,
      Investigador: 4,
      Social: 1,
      Artístico: 1,
    },
    description:
      "Prepara y examina registros financieros, asegurando su precisión y que los impuestos se paguen correctamente y a tiempo.",
    skills: [
      "Matemáticas",
      "Análisis financiero",
      "Atención al detalle",
      "Conocimiento de software contable",
    ],
    jobOutlook:
      "Se proyecta un crecimiento del 6% en la demanda de contadores en Colombia para el período 2020-2025.",
  },
  {
    name: "Profesor",
    profile: {
      Social: 5,
      Artístico: 3,
      Investigador: 2,
      Realista: 1,
      Emprendedor: 3,
      Convencional: 2,
    },
    description:
      "Instruye a estudiantes en una variedad de temas académicos, sociales y habilidades para la vida.",
    skills: ["Comunicación", "Paciencia", "Creatividad", "Gestión del aula"],
    jobOutlook:
      "Se espera un crecimiento del 8% en la demanda de profesores en Colombia para el período 2020-2025, especialmente en áreas rurales y educación superior.",
  },
  {
    name: "Programador",
    profile: {
      Investigador: 5,
      Realista: 3,
      Convencional: 2,
      Artístico: 2,
      Social: 1,
      Emprendedor: 2,
    },
    description: "Escribe y prueba código para crear software funcional y eficiente.",
    skills: [
      "Lenguajes de programación",
      "Resolución de problemas",
      "Atención al detalle",
      "Trabajo en equipo",
    ],
    jobOutlook:
      "Se proyecta un crecimiento del 20% en la demanda de programadores en Colombia para el período 2020-2025, impulsado por la transformación digital.",
  },
  {
    name: "Arquitecto",
    profile: {
      Artístico: 4,
      Realista: 3,
      Investigador: 3,
      Convencional: 2,
      Emprendedor: 2,
      Social: 1,
    },
    description: "Diseña edificios y estructuras, combinando funcionalidad y estética.",
    skills: ["Diseño CAD", "Gestión de proyectos", "Creatividad", "Conocimientos técnicos"],
    jobOutlook:
      "Se espera un crecimiento del 5% en la demanda de arquitectos en Colombia para el período 2020-2025, impulsado por proyectos de infraestructura y vivienda.",
  },
  {
    name: "Gerente de Marketing",
    profile: {
      Emprendedor: 5,
      Social: 4,
      Artístico: 3,
      Convencional: 2,
      Investigador: 1,
      Realista: 1,
    },
    description:
      "Planifica y dirige programas de marketing para generar interés en productos o servicios.",
    skills: ["Estrategia", "Análisis de datos", "Comunicación", "Creatividad"],
    jobOutlook:
      "Se proyecta un crecimiento del 12% en la demanda de gerentes de marketing en Colombia para el período 2020-2025, impulsado por la digitalización y el comercio electrónico.",
  },
  {
    name: "Ingeniero de Software",
    profile: {
      Investigador: 5,
      Realista: 3,
      Convencional: 3,
      Artístico: 2,
      Social: 1,
      Emprendedor: 2,
    },
    description: "Diseña, desarrolla y mantiene software y sistemas informáticos.",
    skills: ["Programación", "Resolución de problemas", "Pensamiento lógico", "Trabajo en equipo"],
    jobOutlook:
      "Se espera un crecimiento del 25% en la demanda de ingenieros de software en Colombia para el período 2020-2025, debido a la creciente digitalización de las empresas.",
  },
  {
    name: "Médico",
    profile: {
      Investigador: 5,
      Social: 4,
      Realista: 3,
      Convencional: 2,
      Emprendedor: 1,
      Artístico: 1,
    },
    description: "Diagnostica y trata enfermedades, lesiones y otros problemas de salud.",
    skills: ["Diagnóstico", "Empatía", "Comunicación", "Toma de decisiones"],
    jobOutlook:
      "Se proyecta un crecimiento del 15% en la demanda de médicos en Colombia para el período 2020-2025, especialmente en áreas rurales y especialidades médicas.",
  },
  {
    name: "Abogado",
    profile: {
      Emprendedor: 4,
      Investigador: 4,
      Social: 3,
      Convencional: 3,
      Artístico: 1,
      Realista: 1,
    },
    description: "Asesora y representa a clientes en asuntos legales y disputas.",
    skills: ["Análisis legal", "Argumentación", "Investigación", "Negociación"],
    jobOutlook:
      "Se espera un crecimiento del 7% en la demanda de abogados en Colombia para el período 2020-2025, con oportunidades en derecho ambiental y tecnológico.",
  },
  {
    name: "Periodista",
    profile: {
      Social: 4,
      Investigador: 4,
      Artístico: 3,
      Emprendedor: 2,
      Convencional: 2,
      Realista: 1,
    },
    description: "Investiga, reporta y analiza noticias y eventos actuales.",
    skills: ["Redacción", "Investigación", "Comunicación", "Pensamiento crítico"],
    jobOutlook:
      "Se proyecta un crecimiento del 3% en la demanda de periodistas en Colombia para el período 2020-2025, con énfasis en periodismo digital y multimedia.",
  },
  {
    name: "Chef",
    profile: {
      Artístico: 5,
      Realista: 4,
      Emprendedor: 3,
      Social: 2,
      Investigador: 1,
      Convencional: 1,
    },
    description: "Crea menús, prepara comidas y supervisa las operaciones de cocina.",
    skills: [
      "Creatividad culinaria",
      "Gestión del tiempo",
      "Trabajo en equipo",
      "Atención al detalle",
    ],
    jobOutlook:
      "Se espera un crecimiento del 8% en la demanda de chefs en Colombia para el período 2020-2025, impulsado por el turismo gastronómico y la innovación culinaria.",
  },
  {
    name: "Ingeniería Civil",
    profile: {
      Realista: 5,
      Investigador: 4,
      Convencional: 3,
      Artístico: 1,
      Social: 2,
      Emprendedor: 2,
    },
    description:
      "Diseña, planifica y supervisa la construcción de infraestructuras y edificaciones.",
    skills: ["Matemáticas", "Física", "Diseño estructural", "Gestión de proyectos"],
    jobOutlook:
      "Se proyecta un crecimiento del 10% en la demanda de ingenieros civiles en Colombia para el período 2020-2025, impulsado por proyectos de infraestructura y desarrollo urbano.",
  },
  {
    name: "Medicina Veterinaria",
    profile: {
      Investigador: 5,
      Social: 4,
      Realista: 3,
      Convencional: 2,
      Emprendedor: 1,
      Artístico: 1,
    },
    description: "Diagnostica y trata enfermedades en animales, promoviendo su salud y bienestar.",
    skills: ["Biología", "Anatomía animal", "Diagnóstico", "Cirugía"],
    jobOutlook:
      "Se espera un crecimiento del 9% en la demanda de médicos veterinarios en Colombia para el período 2020-2025, con oportunidades en salud pública y producción animal.",
  },
  {
    name: "Administración de Empresas",
    profile: {
      Emprendedor: 5,
      Convencional: 4,
      Social: 3,
      Investigador: 2,
      Realista: 1,
      Artístico: 1,
    },
    description:
      "Gestiona y dirige organizaciones, optimizando recursos y procesos para alcanzar objetivos empresariales.",
    skills: ["Liderazgo", "Finanzas", "Marketing", "Gestión de recursos humanos"],
    jobOutlook:
      "Se proyecta un crecimiento del 8% en la demanda de administradores de empresas en Colombia para el período 2020-2025, con énfasis en habilidades digitales y gestión de la innovación.",
  },
  {
    name: "Ingeniería de Sistemas",
    profile: {
      Investigador: 5,
      Convencional: 3,
      Realista: 3,
      Emprendedor: 2,
      Artístico: 2,
      Social: 1,
    },
    description:
      "Diseña, desarrolla y mantiene sistemas informáticos y tecnológicos para resolver problemas organizacionales y de la sociedad.",
    skills: ["Programación", "Análisis de sistemas", "Bases de datos", "Redes"],
    jobOutlook:
      "Se espera un crecimiento del 22% en la demanda de ingenieros de sistemas en Colombia para el período 2020-2025, impulsado por la transformación digital y la adopción de nuevas tecnologías.",
  },
];

/*
Fuentes de información para las perspectivas laborales:
1. Observatorio Laboral para la Educación (OLE): [https://ole.mineducacion.gov.co/portal/](https://ole.mineducacion.gov.co/portal/)
2. Ministerio de Trabajo de Colombia: [https://www.mintrabajo.gov.co/](https://www.mintrabajo.gov.co/)
3. DANE (Departamento Administrativo Nacional de Estadística): [https://www.dane.gov.co/](https://www.dane.gov.co/)
4. Asociación Colombiana de Facultades de Ingeniería (ACOFI): [https://www.acofi.edu.co/](https://www.acofi.edu.co/)
5. Observatorio TI (MinTIC): [https://www.observatorioti.gov.co/](https://www.observatorioti.gov.co/)
6. Asociación Colombiana de Facultades de Medicina (ASCOFAME): [https://ascofame.org.co/](https://ascofame.org.co/)
7. Consejo Profesional Nacional de Ingeniería (COPNIA): [https://www.copnia.gov.co/](https://www.copnia.gov.co/)
8. Asociación Colombiana de Facultades de Psicología (ASCOFAPSI): [https://www.ascofapsi.org.co/](https://www.ascofapsi.org.co/)
9. Colegio Colombiano de Psicólogos: [https://www.colpsic.org.co/](https://www.colpsic.org.co/)
10. Asociación Colombiana de Facultades de Administración (ASCOLFA): [https://www.ascolfa.edu.co/](https://www.ascolfa.edu.co/)
*/

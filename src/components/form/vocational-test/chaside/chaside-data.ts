export type PersonalityType = "C" | "H" | "A" | "S" | "I" | "D" | "E";

export type Question = {
  text: string;
  type: PersonalityType;
};

export const questions: Question[] = [
  // C - Constructivo
  {
    text: "¿Te gusta más construir cosas que analizar? (ej: muebles, modelos, estructuras)",
    type: "C",
  },
  {
    text: "¿Prefieres trabajar con planos que con textos? (ej: arquitectura, ingeniería, diseño técnico)",
    type: "C",
  },
  {
    text: "¿Te gusta más diseñar que investigar? (ej: crear soluciones, planificar proyectos)",
    type: "C",
  },
  {
    text: "¿Prefieres habilidades técnicas que sociales? (ej: programación, mecánica, electricidad)",
    type: "C",
  },
  {
    text: "¿Te gusta más crear productos físicos? (ej: artesanías, tecnología, construcción)",
    type: "C",
  },
  {
    text: "¿Prefieres precisión técnica que creatividad? (ej: mediciones exactas, cálculos precisos)",
    type: "C",
  },
  {
    text: "¿Te motiva más crear soluciones tangibles? (ej: arreglar problemas, construir herramientas)",
    type: "C",
  },
  {
    text: "¿Te gusta más trabajar con máquinas? (ej: computadoras, herramientas, equipos)",
    type: "C",
  },

  // H - Humanitario
  {
    text: "¿Prefieres entender las necesidades de otros? (ej: psicología, trabajo social, consejería)",
    type: "H",
  },
  {
    text: "¿Te gusta más explicar que aplicar? (ej: enseñanza, capacitación, mentoría)",
    type: "H",
  },
  {
    text: "¿Prefieres empatía que trabajo técnico? (ej: escuchar, comprender emociones)",
    type: "H",
  },
  {
    text: "¿Te gusta más resolver problemas de personas? (ej: mediación, terapia, coaching)",
    type: "H",
  },
  {
    text: "¿Prefieres enseñar que aprender solo? (ej: profesor, entrenador, facilitador)",
    type: "H",
  },
  {
    text: "¿Te gusta más comunicación constante? (ej: atención al cliente, ventas, servicios)",
    type: "H",
  },
  {
    text: "¿Te motiva más ayudar a otros? (ej: voluntariado, enfermería, asistencia social)",
    type: "H",
  },
  {
    text: "¿Prefieres trabajar en equipo? (ej: proyectos colaborativos, grupos de trabajo)",
    type: "H",
  },

  // A - Artístico
  {
    text: "¿Te gusta más crear diseños únicos? (ej: logos, carteles, páginas web)",
    type: "A",
  },
  {
    text: "¿Te gusta más expresarte de forma artística? (ej: pintar, cantar, bailar)",
    type: "A",
  },
  {
    text: "¿Te gusta más trabajar con colores? (ej: pintura, diseño gráfico, decoración)",
    type: "A",
  },
  {
    text: "¿Te gusta más crear historias o narrativas? (ej: escribir cuentos, guiones, poesía)",
    type: "A",
  },
  {
    text: "¿Te gusta más crear conceptos originales? (ej: ideas creativas, innovación)",
    type: "A",
  },
  {
    text: "¿Te gusta más expresar ideas de forma artística? (ej: arte visual, música, teatro)",
    type: "A",
  },
  {
    text: "¿Te gusta más experimentar con diferentes formas? (ej: escultura, arquitectura, moda)",
    type: "A",
  },
  {
    text: "¿Prefieres proyectos únicos? (ej: obras originales, diseños personalizados)",
    type: "A",
  },

  // S - Salud y Social
  {
    text: "¿Prefieres trabajos relacionados con la salud? (ej: medicina, enfermería, fisioterapia)",
    type: "S",
  },
  {
    text: "¿Te gusta más conocimientos médicos? (ej: anatomía, fisiología, farmacología)",
    type: "S",
  },
  {
    text: "¿Te gusta más conocimientos médicos? (ej: diagnóstico, tratamiento, prevención)",
    type: "S",
  },
  {
    text: "¿Prefieres cuidar a otros? (ej: atención al paciente, cuidados paliativos)",
    type: "S",
  },
  {
    text: "¿Te gusta más investigar temas de salud? (ej: estudios clínicos, epidemiología)",
    type: "S",
  },
  {
    text: "¿Te gusta más trabajar con personas que necesitan ayuda? (ej: rehabilitación, terapia)",
    type: "S",
  },
  {
    text: "¿Te motiva más mejorar la salud de otros? (ej: medicina preventiva, educación sanitaria)",
    type: "S",
  },
  {
    text: "¿Te gusta más conocimientos biológicos? (ej: microbiología, genética, bioquímica)",
    type: "S",
  },

  // I - Investigativo
  {
    text: "¿Prefieres analizar información detalladamente? (ej: datos, estadísticas, reportes)",
    type: "I",
  },
  {
    text: "¿Te gusta más investigar que implementar? (ej: estudios científicos, experimentos)",
    type: "I",
  },
  {
    text: "¿Prefieres problemas complejos? (ej: puzzles difíciles, enigmas matemáticos)",
    type: "I",
  },
  {
    text: "¿Te gusta más pensamiento lógico? (ej: razonamiento deductivo, análisis crítico)",
    type: "I",
  },
  {
    text: "¿Te gusta más encontrar explicaciones a las cosas? (ej: por qué suceden los fenómenos)",
    type: "I",
  },
  {
    text: "¿Te gusta más análisis de datos? (ej: estadísticas, investigación de mercado)",
    type: "I",
  },
  {
    text: "¿Te motiva más descubrir nuevas cosas? (ej: explorar teorías, investigar fenómenos)",
    type: "I",
  },
  {
    text: "¿Te gusta más resolver acertijos complejos? (ej: puzzles lógicos, problemas matemáticos)",
    type: "I",
  },

  // D - Defensivo
  {
    text: "¿Prefieres seguir reglas estrictas? (ej: protocolos, normas, estándares)",
    type: "D",
  },
  {
    text: "¿Te sientes mejor en entornos estructurados? (ej: horarios fijos, procedimientos claros)",
    type: "D",
  },
  {
    text: "¿Prefieres seguir procedimientos establecidos? (ej: manuales, guías, procesos)",
    type: "D",
  },
  {
    text: "¿Te gusta más coordinación que iniciativa? (ej: trabajo en equipo, colaboración)",
    type: "D",
  },
  {
    text: "¿Prefieres mantener el orden? (ej: organización, limpieza, estructura)",
    type: "D",
  },
  {
    text: "¿Te gusta más trabajo en equipo estructurado? (ej: proyectos organizados, roles definidos)",
    type: "D",
  },
  {
    text: "¿Te motiva más la seguridad? (ej: estabilidad laboral, beneficios, protección)",
    type: "D",
  },
  {
    text: "¿Te gusta más seguir protocolos? (ej: procedimientos, reglas, estándares)",
    type: "D",
  },

  // E - Empresarial
  {
    text: "¿Te gusta más dirigir proyectos? (ej: liderar equipos, gestionar recursos)",
    type: "E",
  },
  {
    text: "¿Te gusta más tomar decisiones? (ej: elegir estrategias, resolver problemas empresariales)",
    type: "E",
  },
  {
    text: "¿Te gusta más presentar ideas a otros? (ej: ventas, marketing, presentaciones)",
    type: "E",
  },
  {
    text: "¿Te gusta más iniciativa propia? (ej: emprender, crear proyectos, innovar)",
    type: "E",
  },
  {
    text: "¿Prefieres crear estrategias? (ej: planificación empresarial, marketing, negocios)",
    type: "E",
  },
  {
    text: "¿Te gusta más persuasión que análisis? (ej: ventas, negociación, influencia)",
    type: "E",
  },
  {
    text: "¿Te motiva más los resultados? (ej: alcanzar metas, cumplir objetivos, éxito)",
    type: "E",
  },
  {
    text: "¿Te gusta más buscar acuerdos beneficiosos? (ej: negociación, alianzas, contratos)",
    type: "E",
  },

  // Preguntas sutiles sobre preferencias académicas (parecen parte del test)
  {
    text: "¿Te gusta más leer libros técnicos que novelas? (ej: manuales, textos científicos)",
    type: "I",
  },
  {
    text: "¿Prefieres ver documentales científicos? (ej: naturaleza, tecnología, historia)",
    type: "I",
  },
  {
    text: "¿Te gusta más aprender idiomas? (ej: inglés, francés, comunicación intercultural)",
    type: "H",
  },
  {
    text: "¿Prefieres la historia y las culturas? (ej: antropología, arqueología, sociología)",
    type: "H",
  },
  {
    text: "¿Te gusta más dibujar y diseñar? (ej: ilustración, diseño gráfico, bocetos)",
    type: "A",
  },
  {
    text: "¿Prefieres la música y el arte? (ej: pintura, escultura, artes escénicas)",
    type: "A",
  },
  {
    text: "¿Te gusta más usar computadoras y tecnología? (ej: programación, sistemas, diseño web)",
    type: "C",
  },
  {
    text: "¿Prefieres los juegos de estrategia? (ej: ajedrez, videojuegos tácticos, planificación)",
    type: "E",
  },
  {
    text: "¿Te gusta más planificar y organizar? (ej: eventos, proyectos, horarios)",
    type: "D",
  },
  {
    text: "¿Prefieres los rompecabezas y acertijos? (ej: puzzles lógicos, sudoku, enigmas)",
    type: "I",
  },
  {
    text: "¿Te gusta más escribir historias? (ej: cuentos, novelas, guiones)",
    type: "A",
  },
  {
    text: "¿Prefieres ayudar a otros con sus problemas? (ej: consejería, terapia, apoyo)",
    type: "H",
  },
  {
    text: "¿Te gusta más los deportes y la actividad física? (ej: entrenamiento, rehabilitación, fitness)",
    type: "S",
  },
  {
    text: "¿Prefieres vender o promocionar cosas? (ej: marketing, publicidad, comercio)",
    type: "E",
  },
  {
    text: "¿Te gusta más mantener todo ordenado? (ej: organización, limpieza, estructura)",
    type: "D",
  },
];

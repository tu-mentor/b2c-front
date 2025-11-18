// Define the available fields as a constant to ensure consistency
export const CAREER_FIELDS = {
  EDUCATION: "Educación",
  ARTS_HUMANITIES: "Arte y Humanidades",
  SOCIAL_SCIENCES: "Ciencias Sociales, Periodismo e Información",
  BUSINESS_LAW: "Administración de Empresas y Derecho",
  NATURAL_SCIENCES: "Ciencias Naturales, Matemáticas y Estadística",
  ICT: "Tecnologías de la Información y la Comunicación (TIC)",
  ENGINEERING: "Ingeniería, Industria y Construcción",
  AGRICULTURE: "Agropecuario, Silvicultura, Pesca y Veterinaria",
  HEALTH: "Salud y Bienestar",
  SERVICES: "Servicios"
} as const;

// Career to field mapping function
export function mapCareerToField(career: string): string[] {
  // Normalize the career name for comparison
  const normalizedCareer = career.toLowerCase().trim();
  const fields: string[] = [];
  
  // Education
  if (normalizedCareer.includes('educación') || 
      normalizedCareer.includes('pedagogía') || 
      normalizedCareer.includes('docencia') ||
      normalizedCareer.includes('enseñanza') ||
      normalizedCareer.includes('licenciatura') ||
      normalizedCareer.includes('magisterio') ||
      normalizedCareer.includes('didáctica') ||
      normalizedCareer.includes('ciencias de la educación') ||
      normalizedCareer.includes('psicopedagogía') ||
      normalizedCareer.includes('educación especial') ||
      normalizedCareer.includes('educación física') ||
      normalizedCareer.includes('educación infantil') ||
      normalizedCareer.includes('educación social')) {
    fields.push(CAREER_FIELDS.EDUCATION);
  }
  
  // Arts & Humanities
  if (normalizedCareer.includes('arte') || 
      normalizedCareer.includes('música') || 
      normalizedCareer.includes('filosofía') ||
      normalizedCareer.includes('historia') ||
      normalizedCareer.includes('literatura') ||
      normalizedCareer.includes('diseño') ||
      normalizedCareer.includes('bellas artes') ||
      normalizedCareer.includes('artes plásticas') ||
      normalizedCareer.includes('artes escénicas') ||
      normalizedCareer.includes('teatro') ||
      normalizedCareer.includes('danza') ||
      normalizedCareer.includes('cine') ||
      normalizedCareer.includes('audiovisual') ||
      normalizedCareer.includes('fotografía') ||
      normalizedCareer.includes('lingüística') ||
      normalizedCareer.includes('idiomas') ||
      normalizedCareer.includes('lenguas modernas') ||
      normalizedCareer.includes('filología') ||
      normalizedCareer.includes('arqueología') ||
      normalizedCareer.includes('museología') ||
      normalizedCareer.includes('conservación') ||
      normalizedCareer.includes('restauración') ||
      normalizedCareer.includes('humanidades')) {
    fields.push(CAREER_FIELDS.ARTS_HUMANITIES);
  }
  
  // Social Sciences
  if (normalizedCareer.includes('sociología') || 
      normalizedCareer.includes('periodismo') || 
      normalizedCareer.includes('comunicación') ||
      normalizedCareer.includes('antropología') ||
      normalizedCareer.includes('política') ||
      normalizedCareer.includes('ciencias políticas') ||
      normalizedCareer.includes('relaciones internacionales') ||
      normalizedCareer.includes('trabajo social') ||
      normalizedCareer.includes('geografía') ||
      normalizedCareer.includes('demografía') ||
      normalizedCareer.includes('estudios de género') ||
      normalizedCareer.includes('desarrollo social') ||
      normalizedCareer.includes('ciencias sociales') ||
      normalizedCareer.includes('estudios culturales') ||
      normalizedCareer.includes('bibliotecología') ||
      normalizedCareer.includes('archivística') ||
      normalizedCareer.includes('ciencias de la información')) {
    fields.push(CAREER_FIELDS.SOCIAL_SCIENCES);
  }
  
  // Business & Law
  if (normalizedCareer.includes('administración') || 
      normalizedCareer.includes('derecho') || 
      normalizedCareer.includes('economía') ||
      normalizedCareer.includes('contabilidad') ||
      normalizedCareer.includes('finanzas') ||
      normalizedCareer.includes('negocios') ||
      normalizedCareer.includes('empresariales') ||
      normalizedCareer.includes('mercadeo') ||
      normalizedCareer.includes('marketing') ||
      normalizedCareer.includes('publicidad') ||
      normalizedCareer.includes('comercio') ||
      normalizedCareer.includes('comercial') ||
      normalizedCareer.includes('gestión') ||
      normalizedCareer.includes('recursos humanos') ||
      normalizedCareer.includes('logística') ||
      normalizedCareer.includes('tributaria') ||
      normalizedCareer.includes('aduanas') ||
      normalizedCareer.includes('banca') ||
      normalizedCareer.includes('seguros') ||
      normalizedCareer.includes('jurisprudencia') ||
      normalizedCareer.includes('ciencias jurídicas') ||
      normalizedCareer.includes('legislación')) {
    fields.push(CAREER_FIELDS.BUSINESS_LAW);
  }
  
  // Natural Sciences
  if (normalizedCareer.includes('matemática') || 
      normalizedCareer.includes('física') || 
      normalizedCareer.includes('química') ||
      normalizedCareer.includes('biología') ||
      normalizedCareer.includes('estadística') ||
      normalizedCareer.includes('ciencias naturales') ||
      normalizedCareer.includes('geología') ||
      normalizedCareer.includes('astronomía') ||
      normalizedCareer.includes('meteorología') ||
      normalizedCareer.includes('oceanografía') ||
      normalizedCareer.includes('biotecnología') ||
      normalizedCareer.includes('microbiología') ||
      normalizedCareer.includes('bioquímica') ||
      normalizedCareer.includes('genética') ||
      normalizedCareer.includes('ecología') ||
      normalizedCareer.includes('ciencias ambientales') ||
      normalizedCareer.includes('ciencias de la tierra') ||
      normalizedCareer.includes('ciencias del mar')) {
    fields.push(CAREER_FIELDS.NATURAL_SCIENCES);
  }
  
  // ICT
  if (normalizedCareer.includes('informática') || 
      normalizedCareer.includes('sistemas') || 
      normalizedCareer.includes('computación') ||
      normalizedCareer.includes('software') ||
      normalizedCareer.includes('datos') ||
      normalizedCareer.includes('tecnologías de la información') ||
      normalizedCareer.includes('redes') ||
      normalizedCareer.includes('telecomunicaciones') ||
      normalizedCareer.includes('ciberseguridad') ||
      normalizedCareer.includes('inteligencia artificial') ||
      normalizedCareer.includes('machine learning') ||
      normalizedCareer.includes('big data') ||
      normalizedCareer.includes('análisis de datos') ||
      normalizedCareer.includes('desarrollo web') ||
      normalizedCareer.includes('desarrollo de aplicaciones') ||
      normalizedCareer.includes('programación') ||
      normalizedCareer.includes('robótica') ||
      normalizedCareer.includes('iot') ||
      normalizedCareer.includes('internet de las cosas') ||
      normalizedCareer.includes('cloud computing') ||
      normalizedCareer.includes('computación en la nube')) {
    fields.push(CAREER_FIELDS.ICT);
  }
  
  // Engineering
  if (normalizedCareer.includes('ingeniería') || 
      normalizedCareer.includes('arquitectura') || 
      normalizedCareer.includes('construcción') ||
      normalizedCareer.includes('mecánica') ||
      normalizedCareer.includes('industrial') ||
      normalizedCareer.includes('civil') ||
      normalizedCareer.includes('eléctrica') ||
      normalizedCareer.includes('electrónica') ||
      normalizedCareer.includes('química') ||
      normalizedCareer.includes('materiales') ||
      normalizedCareer.includes('aeronáutica') ||
      normalizedCareer.includes('aeroespacial') ||
      normalizedCareer.includes('naval') ||
      normalizedCareer.includes('automotriz') ||
      normalizedCareer.includes('mecatrónica') ||
      normalizedCareer.includes('biomédica') ||
      normalizedCareer.includes('ambiental') ||
      normalizedCareer.includes('energías') ||
      normalizedCareer.includes('petrolera') ||
      normalizedCareer.includes('minas') ||
      normalizedCareer.includes('metalurgia') ||
      normalizedCareer.includes('topografía') ||
      normalizedCareer.includes('catastral') ||
      normalizedCareer.includes('geodesia') ||
      normalizedCareer.includes('diseño industrial')) {
    fields.push(CAREER_FIELDS.ENGINEERING);
  }
  
  // Agriculture
  if (normalizedCareer.includes('agronomía') || 
      normalizedCareer.includes('veterinaria') || 
      normalizedCareer.includes('forestal') ||
      normalizedCareer.includes('agricultura') ||
      normalizedCareer.includes('pesca') ||
      normalizedCareer.includes('zootecnia') ||
      normalizedCareer.includes('acuicultura') ||
      normalizedCareer.includes('agroindustria') ||
      normalizedCareer.includes('agroecología') ||
      normalizedCareer.includes('agropecuaria') ||
      normalizedCareer.includes('desarrollo rural') ||
      normalizedCareer.includes('ingeniería agrícola') ||
      normalizedCareer.includes('ingeniería agronómica') ||
      normalizedCareer.includes('ingeniería pesquera') ||
      normalizedCareer.includes('medicina veterinaria') ||
      normalizedCareer.includes('producción animal') ||
      normalizedCareer.includes('silvicultura')) {
    fields.push(CAREER_FIELDS.AGRICULTURE);
  }
  
  // Health
  if (normalizedCareer.includes('medicina') || 
      normalizedCareer.includes('enfermería') || 
      normalizedCareer.includes('psicología') ||
      normalizedCareer.includes('nutrición') ||
      normalizedCareer.includes('salud') ||
      normalizedCareer.includes('odontología') ||
      normalizedCareer.includes('farmacia') ||
      normalizedCareer.includes('fisioterapia') ||
      normalizedCareer.includes('terapia ocupacional') ||
      normalizedCareer.includes('fonoaudiología') ||
      normalizedCareer.includes('optometría') ||
      normalizedCareer.includes('radiología') ||
      normalizedCareer.includes('laboratorio clínico') ||
      normalizedCareer.includes('bacteriología') ||
      normalizedCareer.includes('salud pública') ||
      normalizedCareer.includes('salud ocupacional') ||
      normalizedCareer.includes('instrumentación quirúrgica') ||
      normalizedCareer.includes('gerontología') ||
      normalizedCareer.includes('paramédico') ||
      normalizedCareer.includes('emergencias médicas')) {
    fields.push(CAREER_FIELDS.HEALTH);
  }
  
  // Services
  if (normalizedCareer.includes('turismo') || 
      normalizedCareer.includes('hotelería') || 
      normalizedCareer.includes('gastronomía') ||
      normalizedCareer.includes('deporte') ||
      normalizedCareer.includes('servicio') ||
      normalizedCareer.includes('hospitalidad') ||
      normalizedCareer.includes('eventos') ||
      normalizedCareer.includes('recreación') ||
      normalizedCareer.includes('gestión turística') ||
      normalizedCareer.includes('administración hotelera') ||
      normalizedCareer.includes('artes culinarias') ||
      normalizedCareer.includes('ciencias del deporte') ||
      normalizedCareer.includes('entrenamiento deportivo') ||
      normalizedCareer.includes('gestión deportiva') ||
      normalizedCareer.includes('cosmetología') ||
      normalizedCareer.includes('estética') ||
      normalizedCareer.includes('peluquería') ||
      normalizedCareer.includes('servicios de belleza') ||
      normalizedCareer.includes('seguridad y salud en el trabajo') ||
      normalizedCareer.includes('bomberos') ||
      normalizedCareer.includes('policía') ||
      normalizedCareer.includes('fuerzas armadas') ||
      normalizedCareer.includes('servicios de protección')) {
    fields.push(CAREER_FIELDS.SERVICES);
  }
  
  // If no fields were found, return the original career
  if (fields.length === 0) {
    console.warn(`No field mapping found for career: ${career}`);
    return [career];
  }
  
  return fields;
}

// Function to map an array of careers to their corresponding fields
export function mapCareersToFields(careers: string[]): string[] {
  // Map each career to its fields and flatten the array
  const fields = careers.flatMap(mapCareerToField);
  // Remove duplicates
  return [...new Set(fields)];
}
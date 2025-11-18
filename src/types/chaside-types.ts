// chaside-types.ts

export interface ScoresDto {
  C: number; // Ciencias Físico-Matemáticas
  H: number; // Ciencias Sociales
  A: number; // Ciencias Económicas y Políticas
  S: number; // Medicina y Ciencias de la Salud
  I: number; // Ciencias Biológicas
  D: number; // Ciencias de la Comunicación
  E: number; // Artes
}

export interface CreateChasideTestDto {
  childId: string;
  currentQuestion: number;
  scores: ScoresDto;
  careers: string[];
}

export interface UpdateChasideTestDto {
  currentQuestion: number;
  scores: ScoresDto;
  careers: string[];
}

export interface ChasideTestResponseDto {
  id: string;
  childId: string;
  currentQuestion: number;
  scores: ScoresDto;
  careers: string[];
}

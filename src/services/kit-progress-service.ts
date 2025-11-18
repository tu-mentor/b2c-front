import { KitProgressModel } from "../types/kit-progress-types";
import api from "./api";

// Función auxiliar para extraer el ID limpio (sin parámetros de URL)
const extractCleanId = (id: string): string => {
  // Si el ID contiene un signo de interrogación, extraer solo la parte antes de él
  return id.split('?')[0];
};

export const kitProgressService = {
  async updateProgress(
    userId: string,
    progress?: {
      currentStep?: number,
      questions1Completed?: boolean;
      questions2Completed?: boolean;
      questions3Completed?: boolean;
    }
  ): Promise<KitProgressModel> {
    // Limpiar el ID por si contiene parámetros adicionales
    const cleanUserId = extractCleanId(userId);
    console.log(`Actualizando progreso para userId: ${cleanUserId}`);
    
    const response = await api.patch<KitProgressModel>(`/kit-progress/${cleanUserId}`, {
      ...progress,
    });
    return response;
  },

  async getProgress(userId: string): Promise<KitProgressModel> {
    // Limpiar el ID por si contiene parámetros adicionales
    const cleanUserId = extractCleanId(userId);
    console.log(`Obteniendo progreso para userId: ${cleanUserId}`);
    
    // Añadir un parámetro de no-cache a la petición
    const timestamp = new Date().getTime();
    const response = await api.get<KitProgressModel>(`/kit-progress/${cleanUserId}?nocache=${timestamp}`);
    return response;
  },
};

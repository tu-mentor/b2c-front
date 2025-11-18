import { CreateHollandtDto, ResponseHollandDto, UpdateHollandDto } from "../../types/holland-types";
import api from "../api";

export const hollandTestService = {
  async createHollandTest(data: CreateHollandtDto): Promise<HollandTest> {
    try {
      const response = await api.post<HollandTest>("/holland-test", data);
      return response;
    } catch (error) {
      throw new Error("Failed to create Holland test. Please try again.");
    }
  },

  async getHollandTestByUserId(userId: string): Promise<ResponseHollandDto | null> {
    try {
      const timestamp = Date.now();
      const response = await api.get<ResponseHollandDto>(`/holland-test?userId=${userId}&t=${timestamp}`);
      return response;
    } catch (error: any) {
      // Si es un 404, retornamos null (no hay test guardado aún)
      if (error?.response?.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch Holland test. Please try again.");
    }
  },

  async getHollandTestById(id: string): Promise<ResponseHollandDto> {
    try {
      const timestamp = Date.now();
      const response = await api.get<ResponseHollandDto>(`/holland-test/${id}?t=${timestamp}`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch Holland test. Please try again.");
    }
  },

  async updateHollandTest(id: string, data: UpdateHollandDto): Promise<ResponseHollandDto> {
    try {
      const response = await api.put<ResponseHollandDto>(`/holland-test/${id}`, data);
      return response;
    } catch (error) {
      throw new Error("Failed to update Holland test. Please try again.");
    }
  },
};

export interface HollandTest {
  id: string;
}

export type { CreateHollandtDto, UpdateHollandDto };


import { CreateChasideTestDto, ChasideTestResponseDto, UpdateChasideTestDto } from "../../types/chaside-types";
import api from "../api";

export const chasideTestService = {
  async createChasideTest(data: CreateChasideTestDto): Promise<ChasideTestResponseDto> {
    try {
      const response = await api.post<ChasideTestResponseDto>("/chaside-test", data);
      return response;
    } catch (error) {
      throw new Error("Failed to create Chaside test. Please try again.");
    }
  },

  async getChasideTestByUserId(userId: string): Promise<ChasideTestResponseDto> {
    try {
      const timestamp = Date.now();
      const response = await api.get<ChasideTestResponseDto>(`/chaside-test/${userId}?t=${timestamp}`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch Chaside test. Please try again.");
    }
  },

  async updateChasideTest(id: string, data: UpdateChasideTestDto): Promise<ChasideTestResponseDto> {
    try {
      const response = await api.put<ChasideTestResponseDto>(`/chaside-test/${id}`, data);
      return response;
    } catch (error) {
      throw new Error("Failed to update Chaside test. Please try again.");
    }
  },
};

export type { CreateChasideTestDto, UpdateChasideTestDto, ChasideTestResponseDto };
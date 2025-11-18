import { School } from "../types/school-types";
import api from "./api";

export const schoolService = {
  async getAllSchools(): Promise<School[]> {
    const response = await api.get<School[]>("/schools");
    return response;
  },
};

export type { School };


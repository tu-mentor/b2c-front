import { LoginResponse, UserModel } from "../types/auth-types";
import api from "./api";

export const userService = {
  async createUser(data: Omit<UserModel, "id">): Promise<{ id: string }> {
    const response = await api.post<{ id: string }>("/users", data);
    return response;
  },

  async updateUser(id: string, data: any): Promise<UserModel> {
    const response = await api.patch<any>(`/users/${id}`, data);
    return response;
  },

  async getUser(id: string): Promise<LoginResponse> {
    const response = await api.get<any>(`/users/${id}`);
    return response;
  },

  async updatePassword(data: {
    id: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<any> {
    const response = await api.post<any>("/users/update-password", data);
    return response;
  },
};

export type { LoginResponse, UserModel };

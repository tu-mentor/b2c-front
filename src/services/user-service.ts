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
    const userData = await api.get<any>(`/users/${id}`);
    console.log("userService.getUser: Respuesta completa del API:", JSON.stringify(userData, null, 2));
    
    // El endpoint puede retornar directamente el usuario o con estructura {user: {...}}
    let user: any;
    if (userData.user) {
      // Ya viene con estructura {user: {...}, access_token: ''}
      user = userData.user;
      console.log("userService.getUser: Usuario extraído de userData.user:", user);
    } else {
      // Viene directamente el usuario
      user = userData;
      console.log("userService.getUser: Usuario directo:", user);
    }
    
    console.log("userService.getUser: Rol del usuario:", user?.role);
    
    const response: LoginResponse = {
      access_token: userData.access_token || '',
      user: user as UserModel
    };
    console.log("userService.getUser: Respuesta transformada:", response);
    console.log("userService.getUser: Rol en respuesta final:", response.user?.role);
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

  async verifyEmail(email: string, verificationCode: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/verify-email", {
      email,
      verificationCode,
    });
    return response;
  },

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/resend-verification-code", {
      email,
    });
    return response;
  },
};

export type { LoginResponse, UserModel };

import axios from "axios";
import { LoginCredentials, LoginResponse, UserModel } from "../types/auth-types";
import api from "./api";
import { userService } from "./user-service";

export async function requestPasswordReset(whatsapp: string, childName: string): Promise<void> {
  try {
    await api.post("/auth/reset-password-request", { whatsapp, childName });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred while requesting password reset";
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    await api.post("/auth/reset-password", { token, newPassword });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred while resetting the password";
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
}


export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);    
    return response;
  } catch (error: any ) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred during login";
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
}

export function saveToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function removeToken(): void {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated(): string | null {
  return getToken();
}

export function saveUseId(userId: string): void {
  localStorage.setItem("user_id", userId);
}

export function getUserId(): string {
  return localStorage.getItem("user_id") || "";
}

export async function getUserInfo(userId: string): Promise<LoginResponse | null> {
  const userInfo = await userService.getUser(userId)
  return userInfo;
}

export function removeUserInfo(): void {
  localStorage.removeItem("user_info");
}

export function logout(): void {
  removeToken();
  removeUserInfo();
}
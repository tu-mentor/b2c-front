import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT_MS = 30000; // Aumentar a 30 segundos de timeout
const MAX_RETRIES = 1; // Mantener en 1 solo reintento
const RETRY_DELAY_MS = 500; // Mantener el tiempo de espera para reintentos

class ApiClient {
  private api: AxiosInstance;
  private navigate: ReturnType<typeof useNavigate> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: TIMEOUT_MS,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config;
        
        // Implementar reintentos para errores de red o timeouts
        if (
          (error.code === 'ECONNABORTED' || 
           error.message.includes('timeout') || 
           error.message.includes('Network Error')) &&
          config && 
          (!config.hasOwnProperty('retryCount') || (config as any).retryCount < MAX_RETRIES)
        ) {
          // Incrementar el contador de reintentos
          (config as any).retryCount = (config as any).retryCount || 0;
          (config as any).retryCount++;

          // Esperar antes de reintentar
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (config as any).retryCount));
          
          // Reintentar la petición
          return this.api(config);
        }

        if (
          error.response &&
          error.response.status === 401 &&
          !error.request.responseURL.includes("/auth/login")
        ) {
          localStorage.removeItem("auth_token");
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    );
  }

  setNavigate(navigate: ReturnType<typeof useNavigate>) {
    this.navigate = navigate;
  }

  async get<T>(url: string, params?: object): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data as T;
      }
      throw error;
    }
  }

  async post<T>(url: string, data: object): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || "Error en la petición");
      }
      throw error;
    }
  }

  async put<T>(url: string, data: object): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || "Error en la petición");
      }
      throw error;
    }
  }

  async patch<T>(url: string, data: object): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.patch(url, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || "Error en la petición");
      }
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || "Error en la petición");
      }
      throw error;
    }
  }
}

export default new ApiClient();

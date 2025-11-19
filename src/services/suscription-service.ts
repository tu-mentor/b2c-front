import { ChildSubscription, CompanySuscriptionResponse, UserSubscription } from "../types/suscriptions";
import api from "./api";

export interface AvailableModule {
  _id: string;
  name: string;
  description: string;
  identifier: number;
  hasAccess: boolean;
  canPurchase: boolean;
}

export interface AvailableModulesResponse {
  modules: AvailableModule[];
  userId: string;
}

export interface PurchaseModuleData {
  moduleId: string;
  months?: number;
  paymentMethod?: string;
  paymentProvider?: string;
  paymentIntentId?: string;
  transactionId?: string;
  requestedOptions?: {
    resultsOptions?: {
      aiAnalysis?: boolean;
      employmentData?: boolean;
      compareCosts?: boolean;
    };
  };
  requestReason?: string;
}

export interface PurchaseModuleResponse {
  success: boolean;
  message: string;
  subscription: any;
}

export const suscriptionService = {
  async getCompanySuscription(uuid: string): Promise<CompanySuscriptionResponse> {
    const response = await api.get<any>(`/subscriptions/validate/${uuid}`);
    return response;
  },

  async getUserSuscription(id: string): Promise<UserSubscription> {
    const response = await api.get<UserSubscription>(`/subscriptions/user/${id}`);
    return response;
  },

  async getAvailableModulesForPurchase(userId: string): Promise<AvailableModulesResponse> {
    const response = await api.get<AvailableModulesResponse>(`/subscriptions/available-modules/${userId}`);
    return response;
  },

  async purchaseModule(userId: string, purchaseData: PurchaseModuleData): Promise<PurchaseModuleResponse> {
    const response = await api.post<PurchaseModuleResponse>(`/subscriptions/purchase-module/${userId}`, purchaseData);
    return response;
  },

  async getMyPurchaseRequests(userId: string): Promise<any> {
    const response = await api.get<any>(`/subscriptions/my-purchase-requests/${userId}`);
    return response;
  },
};

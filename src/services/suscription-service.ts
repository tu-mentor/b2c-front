import { ChildSubscription, CompanySuscriptionResponse } from "../types/suscriptions";
import api from "./api";

export const suscriptionService = {
  async getCompanySuscription(uuid: string): Promise<CompanySuscriptionResponse> {
    const response = await api.get<any>(`/subscriptions/validate/${uuid}`);
    return response;
  },

  async getUserSuscription(id: string): Promise<ChildSubscription[]> {
    const response = await api.get<any>(`/subscriptions/user/${id}`);
    return response;
  },
};

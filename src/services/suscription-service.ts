import { ChildSubscription, CompanySuscriptionResponse, UserSubscription } from "../types/suscriptions";
import api from "./api";

export const suscriptionService = {
  async getCompanySuscription(uuid: string): Promise<CompanySuscriptionResponse> {
    const response = await api.get<any>(`/subscriptions/validate/${uuid}`);
    return response;
  },

  async getUserSuscription(id: string): Promise<UserSubscription> {
    const response = await api.get<UserSubscription>(`/subscriptions/user/${id}`);
    return response;
  },
};

import { ChildModel } from "../types/auth-types";
import { UpdateKitDto } from "../types/child-types";
import api from "./api";

export const childService = {
  async updateChildKit(id: string, kitData: Partial<UpdateKitDto>): Promise<ChildModel> {
    const response = await api.patch<ChildModel>(`/children/${id}/kit`, kitData);
    return response;
  },
};
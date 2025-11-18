import api from "./api";
import {
  AdminUser,
  AdminUserListParams,
  AdminUserListResponse,
  AdminStats,
  CreateUserData,
  UpdateUserData,
} from "../types/admin-types";

export const adminService = {
  // ========== USERS MANAGEMENT ==========

  async getUsers(params: AdminUserListParams = {}): Promise<AdminUserListResponse> {
    const response = await api.get<AdminUserListResponse>("/admin/users", params);
    return response;
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await api.get<AdminUser>(`/admin/users/${id}`);
    return response;
  },

  async getUserByWhatsapp(whatsapp: string): Promise<AdminUser> {
    const response = await api.get<AdminUser>(`/admin/users/whatsapp/${whatsapp}`);
    return response;
  },

  async createUser(data: CreateUserData): Promise<AdminUser> {
    const response = await api.post<AdminUser>("/admin/users", data);
    return response;
  },

  async createUsersBatch(users: CreateUserData[]): Promise<AdminUser[]> {
    const response = await api.post<AdminUser[]>("/admin/users/batch", users);
    return response;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<AdminUser> {
    const response = await api.patch<AdminUser>(`/admin/users/${id}`, data);
    return response;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async resetUserPassword(id: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/admin/users/${id}/reset-password`);
    return response;
  },

  // ========== STATISTICS ==========

  async getStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>("/admin/stats");
    return response;
  },

  // ========== SUBSCRIPTIONS MANAGEMENT ==========

  async getSubscriptions(params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  } = {}): Promise<any> {
    const response = await api.get<any>("/admin/subscriptions", params);
    return response;
  },

  async getSubscriptionById(id: string): Promise<any> {
    const response = await api.get<any>(`/admin/subscriptions/${id}`);
    return response;
  },

  async updateSubscription(id: string, data: any): Promise<any> {
    const response = await api.put(`/admin/subscription/${id}`, data);
    return response;
  },

  async createSubscription(data: any): Promise<any> {
    const response = await api.post<any>("/admin/subscriptions", data);
    return response;
  },

  async getModules(): Promise<any[]> {
    const response = await api.get<any[]>("/admin/modules");
    return response;
  },

  // ========== COMPANY MANAGEMENT ==========

  async updateCompany(id: string, data: any): Promise<any> {
    const response = await api.put(`/admin/company/${id}`, data);
    return response;
  },

  // ========== ADMIN CHECK ==========

  async hasAdmin(): Promise<boolean> {
    const response = await api.get<{ hasAdmin: boolean }>("/admin/has-admin");
    return response.hasAdmin;
  },

  // ========== CUSTOM ROLES MANAGEMENT ==========

  async getCustomRoles(): Promise<any[]> {
    const response = await api.get<any[]>("/admin/custom-roles");
    return response;
  },

  async getCustomRoleById(id: string): Promise<any> {
    const response = await api.get<any>(`/admin/custom-roles/${id}`);
    return response;
  },

  async createCustomRole(data: {
    name: string;
    description?: string;
    permissions: string[];
    isActive?: boolean;
  }): Promise<any> {
    const response = await api.post<any>("/admin/custom-roles", data);
    return response;
  },

  async updateCustomRole(id: string, data: {
    name?: string;
    description?: string;
    permissions?: string[];
    isActive?: boolean;
  }): Promise<any> {
    const response = await api.patch<any>(`/admin/custom-roles/${id}`, data);
    return response;
  },

  async deleteCustomRole(id: string): Promise<void> {
    await api.delete(`/admin/custom-roles/${id}`);
  },

  async assignCustomRoleToUser(userId: string, roleId: string): Promise<any> {
    const response = await api.post<any>(`/admin/users/${userId}/assign-role/${roleId}`);
    return response;
  },

  // ========== PURCHASE REQUESTS MANAGEMENT ==========

  async getPurchaseRequests(
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    const params: any = { page, limit };
    if (status) {
      params.status = status;
    }
    const response = await api.get<any>("/admin/purchase-requests", { params });
    return response;
  },

  async getPurchaseRequestById(requestId: string): Promise<any> {
    const response = await api.get<any>(`/admin/purchase-requests/${requestId}`);
    return response;
  },

  async approvePurchaseRequest(requestId: string, notes?: string): Promise<any> {
    const response = await api.post<any>(`/admin/purchase-requests/${requestId}/approve`, {
      notes: notes || undefined,
    });
    return response;
  },

  async rejectPurchaseRequest(requestId: string, notes?: string): Promise<any> {
    const response = await api.post<any>(`/admin/purchase-requests/${requestId}/reject`, {
      notes: notes || undefined,
    });
    return response;
  },
};


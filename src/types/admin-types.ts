export enum UserRole {
  USER = 'user',
  VIEWER = 'viewer',
  ADMIN = 'admin',
  EDITOR = 'editor',
  CUSTOM = 'custom',
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp?: string;
  role: UserRole;
  status: number;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  companyId?: string;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: number;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  adminUsers: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  pendingPurchaseRequests: number;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  whatsapp?: string;
  countryCode?: string;
  acceptTerms: boolean;
  companyId?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: number;
  emailVerified?: boolean;
}

export enum Permission {
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  VIEW_STATS = 'view_stats',
  VIEW_SUBSCRIPTIONS = 'view_subscriptions',
  EDIT_SUBSCRIPTIONS = 'edit_subscriptions',
  VIEW_COMPANIES = 'view_companies',
  EDIT_COMPANIES = 'edit_companies',
  VIEW_ROLES = 'view_roles',
  CREATE_ROLES = 'create_roles',
  EDIT_ROLES = 'edit_roles',
  DELETE_ROLES = 'delete_roles',
}

export interface CustomRole {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomRoleData {
  name: string;
  description?: string;
  permissions: Permission[];
  isActive?: boolean;
}

export interface UpdateCustomRoleData {
  name?: string;
  description?: string;
  permissions?: Permission[];
  isActive?: boolean;
}


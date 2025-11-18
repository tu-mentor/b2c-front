export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
  password: string;
  countryCode: string;
  acceptTerms: boolean;
  status: string;
  role?: string;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
  companyCharacteristics: CompanyCharacteristic[];
}

export interface CompanyCharacteristic {
  name: string;
  value: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserModel & { role?: string };
}

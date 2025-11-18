export interface LoginCredentials {
  whatsapp: string;
  password: string;
}

export interface ChildModel {
  id: string;
  childName: string;
  school: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  whatsapp: string;
  email: string;
  countryCode: string;
  educationLevel: string;
  acceptTerms: boolean;
  numberOfChildren: number;
  showAlertMessage: boolean;
  selectedChildren: string;
  children: ChildModel[];
  status: string;
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
  user: UserModel;
}

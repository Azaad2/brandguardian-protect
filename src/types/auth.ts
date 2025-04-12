
export interface UserCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export type UserRole = 'brand' | 'reseller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface BrandUser extends User {
  role: 'brand';
  companyName: string;
  industry: string;
  website?: string;
  logo?: string;
}

export interface ResellerUser extends User {
  role: 'reseller';
  companyName: string;
  businessType: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  budget: string;
}

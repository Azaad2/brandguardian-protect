export interface LeadMagnetSubmission {
  id?: string;
  email: string;
  name: string;
  businessType?: string;
  magnetType: string;
  createdAt?: string;
}

export interface LeadMagnetFormValues {
  name: string;
  email: string;
  businessType?: string;
}
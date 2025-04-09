
export interface ContactSubmission {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  email: string;
  marketplaces: string;
  message?: string;
}

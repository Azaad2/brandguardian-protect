
export type ContactFormData = {
  name: string;
  email: string;
  company: string;
  marketplaces: string;
  message?: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string;
  marketplaces: string;
  message?: string;
  createdAt: string;
};

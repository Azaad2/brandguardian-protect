
export type ContactFormData = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productCount: string;
  primaryConcern: string;
};

export type ContactSubmission = ContactFormData & {
  id: string;
  timestamp: string;
};

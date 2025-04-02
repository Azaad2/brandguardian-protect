
export type ContactFormData = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export type ContactSubmission = ContactFormData & {
  id: string;
  date: string;
};

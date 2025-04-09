
import { ResellerFormData } from './reseller';

export type ResellerSubmission = ResellerFormData & {
  id: string;
  createdAt: string;
};


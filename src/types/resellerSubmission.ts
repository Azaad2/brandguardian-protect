
import { ResellerFormData } from './reseller';

export type ResellerSubmission = {
  id: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
} & ResellerFormData;


export interface ResellerApplication {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  status: string;
  user_id: string | null;
}

export interface PendingApplication {
  email: string;
  companyName: string;
}

export interface UseResellerApplicationsState {
  applications: ResellerApplication[];
  loading: boolean;
  refreshing: boolean;
  creatingAccount: Record<string, boolean>;
  passwords: Record<string, string>;
  connectionError: boolean;
  pendingApplications: PendingApplication[];
}

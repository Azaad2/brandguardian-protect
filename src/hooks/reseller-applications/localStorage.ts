
import { PendingApplication } from './types';

const TEMP_STORAGE_KEY = 'pendingResellerApplications';

export const loadPendingApplications = (): PendingApplication[] => {
  const storedApplications = localStorage.getItem(TEMP_STORAGE_KEY);
  return storedApplications ? JSON.parse(storedApplications) : [];
};

export const savePendingApplications = (applications: PendingApplication[]) => {
  if (applications.length > 0) {
    localStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(applications));
  } else {
    localStorage.removeItem(TEMP_STORAGE_KEY);
  }
};

export const clearPendingApplications = () => {
  localStorage.removeItem(TEMP_STORAGE_KEY);
};

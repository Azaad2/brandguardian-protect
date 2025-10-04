import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ResellerApplication, UseResellerApplicationsState, PendingApplication } from './types';
import { loadPendingApplications, savePendingApplications, clearPendingApplications } from './localStorage';
import { generateTemporaryPassword } from './passwordUtils';
import { 
  fetchApplicationsApi, 
  createUserAccountApi, 
  updateApplicationApi, 
  addManualApplicationApi 
} from './api';

export const useResellerApplications = () => {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState<Record<string, boolean>>({});
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [connectionError, setConnectionError] = useState(false);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);

  // Load any pending applications from localStorage
  useEffect(() => {
    const storedApplications = loadPendingApplications();
    setPendingApplications(storedApplications);
  }, []);

  // Save pending applications to localStorage when changed
  useEffect(() => {
    savePendingApplications(pendingApplications);
  }, [pendingApplications]);

  // Sync pending applications when online
  useEffect(() => {
    const syncPendingApplications = async () => {
      if (pendingApplications.length === 0 || connectionError) return;

      try {
        // Try to sync each pending application
        for (const app of pendingApplications) {
          try {
            await addManualApplication(app.email, app.companyName, false);
            // If successful, remove from pending
            setPendingApplications(prev => 
              prev.filter(p => !(p.email === app.email && p.companyName === app.companyName))
            );
          } catch (err) {
            console.error('Failed to sync application:', app, err);
            // Keep in pending if failed
          }
        }
        
        // Clear storage if all synced
        if (pendingApplications.length === 0) {
          clearPendingApplications();
        }
      } catch (error) {
        console.error('Error syncing pending applications:', error);
      }
    };

    const handleOnline = () => {
      // When coming back online, try to sync pending applications
      syncPendingApplications();
      // And refresh the applications list
      fetchResellerApplications();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [pendingApplications, connectionError]);

  const fetchResellerApplications = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      const data = await fetchApplicationsApi();
      setApplications(data);

      // Use stored passwords or generate new ones only for unapproved applications
      const initialPasswords: Record<string, string> = {};
      data.forEach((app: any) => {
        if (app.temporary_password) {
          // Use stored password for approved applications
          initialPasswords[app.id] = app.temporary_password;
        } else if (!app.user_id) {
          // Generate new password only for unapproved applications
          initialPasswords[app.id] = generateTemporaryPassword();
        }
      });
      setPasswords(initialPasswords);
      
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      
      if (error.message && error.message.includes('Failed to fetch')) {
        setConnectionError(true);
      }
      
      toast({
        title: 'Error fetching reseller applications',
        description: error.message || 'Network connection error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePasswordChange = (id: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const createAccount = async (application: ResellerApplication) => {
    if (!passwords[application.id] || passwords[application.id].length < 8) {
      toast({
        title: 'Invalid password',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCreatingAccount((prev) => ({ ...prev, [application.id]: true }));
      console.log('Creating account for:', application.email, 'with password length:', passwords[application.id].length);

      const userData = await createUserAccountApi(
        application.email, 
        passwords[application.id], 
        application.company_name
      );

      console.log('Created user account:', userData);

      await updateApplicationApi(application.id, userData.user?.id);

      toast({
        title: 'Account created successfully',
        description: `Reseller account for ${application.email} has been created.`,
      });

      // Refresh the list
      fetchResellerApplications();

    } catch (error: any) {
      console.error('Error in createAccount:', error);
      
      if (error.message && error.message.includes('Failed to fetch')) {
        setConnectionError(true);
      }
      
      toast({
        title: 'Error creating account',
        description: error.message || 'Network connection error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreatingAccount((prev) => ({ ...prev, [application.id]: false }));
    }
  };

  const addManualApplication = async (email: string, companyName: string, addToPendingIfFailed = true) => {
    if (!email || !companyName) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and company name',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Adding manual application:', { email, companyName });
      
      await addManualApplicationApi(email, companyName);
      setConnectionError(false);

      toast({
        title: 'Application added successfully',
        description: 'The reseller application has been added to the system.',
      });

      // Refresh the list
      fetchResellerApplications();

    } catch (error: any) {
      console.error('Error in addManualApplication:', error);
      
      if (error.message && error.message.includes('Failed to fetch')) {
        setConnectionError(true);
        
        // Add to pending applications to try again when connection is available
        if (addToPendingIfFailed) {
          setPendingApplications(prev => [...prev, { email, companyName }]);
          
          toast({
            title: 'Application saved locally',
            description: 'The application will be submitted when your connection is restored.',
          });
        } else {
          toast({
            title: 'Network connection error',
            description: 'Could not connect to the server. Please check your internet connection.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error adding application',
          description: error.message || "Failed to add application. Please try again.",
          variant: 'destructive',
        });
      }
      
      throw error;
    }
  };

  useEffect(() => {
    fetchResellerApplications();
  }, []);

  return {
    applications,
    loading,
    refreshing,
    creatingAccount,
    passwords,
    fetchResellerApplications,
    handlePasswordChange,
    createAccount,
    addManualApplication,
    setRefreshing,
    connectionError,
    pendingApplications
  };
};

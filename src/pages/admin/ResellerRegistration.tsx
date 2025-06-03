import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ResellerApplicationTable from '@/components/admin/ResellerApplicationTable';
import AddResellerDialog from '@/components/admin/AddResellerDialog';
import { useResellerApplications } from '@/hooks/reseller-applications';

const ResellerRegistration = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const {
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
  } = useResellerApplications();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResellerApplications();
  };

  // Calculate number of pending applications for the badge
  const pendingCount = applications.filter(app => app.status === 'pending').length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reseller Registration Management</h1>
        <Button onClick={() => navigate('/admin')}>Back to Admin</Button>
      </div>

      {!isOnline && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>
            You are currently offline. Some features may be limited until your connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {connectionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Failed to connect to the database. Please check your network connection and try again.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Create Reseller Accounts</CardTitle>
              <CardDescription>
                Create login credentials for resellers who have submitted applications
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing || loading}>
                {refreshing ? 
                  <Loader2 className="h-4 w-4 animate-spin mr-1" /> : 
                  <RefreshCw className="h-4 w-4 mr-1" />}
                Refresh
              </Button>
              <AddResellerDialog 
                onAddApplication={addManualApplication} 
                isOfflineMode={!isOnline || connectionError}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ResellerApplicationTable
              applications={applications}
              passwords={passwords}
              creatingAccount={creatingAccount}
              onPasswordChange={handlePasswordChange}
              onCreateAccount={createAccount}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Note: After creating accounts, inform resellers to use their email and temporary password to log in.
            They will be able to reset their password after logging in.
          </p>
          <Button onClick={fetchResellerApplications} variant="outline">Refresh</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResellerRegistration;

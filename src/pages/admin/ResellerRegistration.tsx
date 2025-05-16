
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import ResellerApplicationTable from '@/components/admin/ResellerApplicationTable';
import AddResellerDialog from '@/components/admin/AddResellerDialog';
import { useResellerApplications } from '@/hooks/useResellerApplications';

const ResellerRegistration = () => {
  const navigate = useNavigate();
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
    setRefreshing
  } = useResellerApplications();

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResellerApplications();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reseller Registration Management</h1>
        <Button onClick={() => navigate('/admin')}>Back to Admin</Button>
      </div>

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
              <AddResellerDialog onAddApplication={addManualApplication} />
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

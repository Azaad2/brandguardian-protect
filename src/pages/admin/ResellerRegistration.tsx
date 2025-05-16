
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResellerApplication {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  status: string;
  user_id: string | null;
}

const ResellerRegistration = () => {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingAccount, setCreatingAccount] = useState<Record<string, boolean>>({});
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchResellerApplications();
  }, []);

  const fetchResellerApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Initialize temporary passwords for each application
      const initialPasswords: Record<string, string> = {};
      data?.forEach(app => {
        initialPasswords[app.id] = generateTemporaryPassword();
      });

      setApplications(data || []);
      setPasswords(initialPasswords);
    } catch (error: any) {
      toast({
        title: 'Error fetching reseller applications',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTemporaryPassword = () => {
    // Generate a random password that meets requirements
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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

      // First check if a user with this email already exists
      const { data: existingUsers, error: existingError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', application.email)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existingUsers) {
        toast({
          title: 'User already exists',
          description: `A user with email ${application.email} already exists in the system.`,
          variant: 'destructive',
        });
        return;
      }

      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email: application.email,
        password: passwords[application.id],
        options: {
          data: {
            full_name: application.company_name, // Using company name as full name
            company_name: application.company_name,
            user_role: 'reseller'
          }
        }
      });

      if (error) throw error;

      // Update the application to link it to the user
      await supabase
        .from('reseller_applications')
        .update({ 
          user_id: data.user?.id,
          status: 'approved' 
        })
        .eq('id', application.id);

      toast({
        title: 'Account created successfully',
        description: `Reseller account for ${application.email} has been created.`,
      });

      // Refresh the list
      fetchResellerApplications();

    } catch (error: any) {
      toast({
        title: 'Error creating account',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreatingAccount((prev) => ({ ...prev, [application.id]: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reseller Registration Management</h1>
        <Button onClick={() => navigate('/admin')}>Back to Admin</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Reseller Accounts</CardTitle>
          <CardDescription>
            Create login credentials for resellers who have submitted applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : applications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No reseller applications found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Temporary Password</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.company_name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {application.user_id ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" /> 
                            Account Created
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600">
                            <XCircle className="h-4 w-4 mr-1" /> 
                            No Account
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="text"
                          value={passwords[application.id] || ''}
                          onChange={(e) => handlePasswordChange(application.id, e.target.value)}
                          disabled={!!application.user_id}
                          placeholder="Temporary password"
                          className="max-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => createAccount(application)}
                          disabled={!!application.user_id || creatingAccount[application.id]}
                          size="sm"
                        >
                          {creatingAccount[application.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : null}
                          {application.user_id ? 'Account Created' : 'Create Account'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

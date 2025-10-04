
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, CheckCircle, XCircle, Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ResellerApplication {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  status: string;
  user_id: string | null;
  temporary_password?: string;
  password_sent_at?: string;
  password_reset_count?: number;
}

interface ResellerApplicationTableProps {
  applications: ResellerApplication[];
  passwords: Record<string, string>;
  creatingAccount: Record<string, boolean>;
  onPasswordChange: (id: string, value: string) => void;
  onCreateAccount: (application: ResellerApplication) => void;
}

const ResellerApplicationTable = ({
  applications,
  passwords,
  creatingAccount,
  onPasswordChange,
  onCreateAccount
}: ResellerApplicationTableProps) => {
  const [resettingPassword, setResettingPassword] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPassword = (appId: string, password: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(appId);
    toast({
      title: "Password copied",
      description: "The password has been copied to your clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetPassword = async (application: ResellerApplication) => {
    if (!passwords[application.id] || passwords[application.id].length < 8) {
      toast({
        title: 'Invalid password',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    try {
      setResettingPassword(prev => ({ ...prev, [application.id]: true }));
      
      const { error } = await supabase.functions.invoke('reset-reseller-password', {
        body: {
          applicationId: application.id,
          userEmail: application.email,
          newPassword: passwords[application.id],
        },
      });

      if (error) throw error;

      toast({
        title: 'Password reset successfully',
        description: `New password sent to ${application.email}`,
      });

      // Refresh the page to show updated data
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error resetting password',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setResettingPassword(prev => ({ ...prev, [application.id]: false }));
    }
  };
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-4">No reseller applications found.</p>
        <p>Use the "Add Manual Application" button to add resellers who sent their applications by email.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Last Sent</TableHead>
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
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <CheckCircle className="h-3 w-3" /> 
                    Created
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1 w-fit">
                    <XCircle className="h-3 w-3" /> 
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 max-w-[200px]">
                  <Input 
                    type="text"
                    value={passwords[application.id] || ''}
                    onChange={(e) => onPasswordChange(application.id, e.target.value)}
                    placeholder="Enter password"
                    className="flex-1"
                  />
                  {application.temporary_password && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyPassword(application.id, application.temporary_password!)}
                      className="p-2"
                      title="Copy stored password"
                    >
                      {copiedId === application.id ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {application.password_sent_at ? (
                  <div className="text-xs">
                    <div>{new Date(application.password_sent_at).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">
                      Resets: {application.password_reset_count || 0}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">Never</span>
                )}
              </TableCell>
              <TableCell>
                {!application.user_id ? (
                  <Button
                    onClick={() => onCreateAccount(application)}
                    disabled={creatingAccount[application.id]}
                    size="sm"
                  >
                    {creatingAccount[application.id] && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Create Account
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleResetPassword(application)}
                    disabled={resettingPassword[application.id]}
                    size="sm"
                    variant="outline"
                  >
                    {resettingPassword[application.id] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset Password
                      </>
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResellerApplicationTable;

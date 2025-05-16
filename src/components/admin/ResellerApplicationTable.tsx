
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ResellerApplication {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  status: string;
  user_id: string | null;
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
                  onChange={(e) => onPasswordChange(application.id, e.target.value)}
                  disabled={!!application.user_id}
                  placeholder="Temporary password"
                  className="max-w-[200px]"
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => onCreateAccount(application)}
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
  );
};

export default ResellerApplicationTable;

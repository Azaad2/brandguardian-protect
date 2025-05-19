
import { useState } from 'react';
import { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { createTestUser } from '@/utils/auth-utils';

const CreateTestAccount = ({ userRole }: { userRole: UserRole }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string, password: string } | null>(null);

  const handleCreateTestAccount = async () => {
    setIsCreating(true);
    
    // Generate a random email and password
    const randomId = Math.floor(Math.random() * 10000);
    const email = `test_${userRole}_${randomId}@example.com`;
    const password = `Password123!`;
    
    try {
      const success = await createTestUser(email, password, userRole);
      
      if (success) {
        setCreatedCredentials({ email, password });
        toast({
          title: "Test account created",
          description: `You can now log in with the provided credentials.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create test account",
          description: "Please try again or check console for errors.",
        });
      }
    } catch (error) {
      console.error('Error creating test account:', error);
      toast({
        variant: "destructive",
        title: "Failed to create test account",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200">
      <h3 className="text-sm font-medium mb-2">Create Test Account</h3>
      
      {!createdCredentials ? (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCreateTestAccount}
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : `Create Test ${userRole === 'reseller' ? 'Reseller' : 'Brand'} Account`}
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-green-600 font-medium">✅ Test account created!</p>
          <div className="bg-slate-100 p-2 rounded text-xs font-mono">
            <p><span className="font-bold">Email:</span> {createdCredentials.email}</p>
            <p><span className="font-bold">Password:</span> {createdCredentials.password}</p>
          </div>
          <p className="text-xs text-slate-500">Copy these credentials before refreshing the page.</p>
        </div>
      )}
    </div>
  );
};

export default CreateTestAccount;

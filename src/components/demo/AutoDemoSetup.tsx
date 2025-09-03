import { useEffect, useState } from 'react';
import { setupCompleteDemo, DEMO_ACCOUNTS } from '@/utils/demo-setup';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AutoDemoSetup = () => {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [setupMessage, setSetupMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('setup-demo') === 'true') {
      handleAutoSetup();
    }
  }, []);

  const handleAutoSetup = async () => {
    setSetupStatus('loading');
    setSetupMessage('Creating demo accounts and sample data...');

    try {
      const result = await setupCompleteDemo();
      
      if (result.success) {
        setSetupStatus('success');
        setSetupMessage('Demo setup completed successfully!');
        toast({
          title: "🎉 Demo Ready!",
          description: "All demo accounts and sample data have been created.",
        });
      } else {
        setSetupStatus('error');
        setSetupMessage(result.message || 'Failed to create demo setup');
        toast({
          variant: "destructive",
          title: "Demo Setup Failed",
          description: result.message,
        });
      }
    } catch (error) {
      setSetupStatus('error');
      setSetupMessage('An unexpected error occurred during setup');
      toast({
        variant: "destructive",
        title: "Setup Error",
        description: "Please try again or contact support.",
      });
    }
  };

  if (setupStatus === 'idle') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {setupStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {setupStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {setupStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            Demo Setup
          </CardTitle>
          <CardDescription>{setupMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          {setupStatus === 'loading' && (
            <div className="space-y-2">
              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                Please wait while we create your demo environment...
              </div>
            </div>
          )}
          
          {setupStatus === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded text-sm text-green-800">
                ✅ Demo setup is complete! You can now use these credentials:
              </div>
              
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <div key={account.email} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="font-medium">{account.role.toUpperCase()} PORTAL</div>
                    <div className="font-mono">{account.email}</div>
                    <div className="font-mono">{account.password}</div>
                    <div className="text-blue-600 font-mono">
                      https://bndbox.com/{account.role}/dashboard
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => window.location.href = '/demo-setup'}
                className="w-full text-sm bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                View Full Demo Guide
              </button>
            </div>
          )}
          
          {setupStatus === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded text-sm text-red-800">
                ❌ Setup failed. Please try again or use the manual demo setup.
              </div>
              
              <button 
                onClick={() => window.location.href = '/demo-setup'}
                className="w-full text-sm bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Go to Manual Demo Setup
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoDemoSetup;
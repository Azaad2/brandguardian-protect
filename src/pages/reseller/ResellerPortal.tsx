
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, UserPlus, ArrowRight, Settings } from 'lucide-react';
import BndBoxLogo from '@/components/branding/BndBoxLogo';

const ResellerPortal = () => {
  const [showToast, setShowToast] = useState(true);
  
  useEffect(() => {
    // Show toast only once when component mounts
    if (showToast) {
      toast({
        title: "Welcome to Reseller Portal",
        description: "Login to access your dashboard or apply for an account.",
        duration: 5000,
      });
      setShowToast(false);
    }
  }, [showToast]);

  useEffect(() => {
  // ✅ Clear localStorage/session on visiting /reseller page
  localStorage.clear(); // or use localStorage.clear() if needed

  // Show toast only once
  if (showToast) {
    toast({
      title: "Welcome to Reseller Portal",
      description: "Login to access your dashboard or apply for an account.",
      duration: 5000,
    });
    setShowToast(false);
  }
}, [showToast]);

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <BndBoxLogo className="h-10" />
          </Link>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/brand">Brand Portal</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/dashboard">Admin Portal</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-center mb-2">Reseller Portal Access</h1>
          <p className="text-gray-600 text-center mb-8">Connect with premium brands and grow your business</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Existing Account Card */}
            <Card>
              <CardHeader className="text-center">
                <UserCheck className="mx-auto h-12 w-12 text-primary mb-2" />
                <CardTitle>Existing Resellers</CardTitle>
                <CardDescription>Already have reseller access? Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6 text-sm">Access your reseller dashboard, place wholesale orders, and connect with brands.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild className="w-full">
                  <Link to="/reseller/login">
                    Login to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* New Application Card */}
            <Card>
              <CardHeader className="text-center">
                <UserPlus className="mx-auto h-12 w-12 text-primary mb-2" />
                <CardTitle>New Resellers</CardTitle>
                <CardDescription>Submit an application to become an approved reseller</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-6 text-sm">Complete our application process to access wholesale purchasing from premium brands.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/reseller-hub">
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/admin/dashboard">
                <Settings className="mr-2 h-4 w-4" />
                Access Admin Portal
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 text-center mt-8">
            Need help? Contact our support team at <a href="mailto:support@bndbox.com" className="text-primary hover:underline">support@bndbox.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResellerPortal;

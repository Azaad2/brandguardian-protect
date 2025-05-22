
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, ArrowRight, Settings } from 'lucide-react';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { toast } from '@/hooks/use-toast';

const BrandPortal = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast({
      title: "Welcome to Brand Portal",
      description: "Login to access your dashboard and manage your wholesale business.",
      duration: 5000,
    });
  }, []);
  
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
              <Link to="/reseller">Reseller Portal</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/dashboard">Admin Portal</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-2">Brand Portal Access</h1>
          <p className="text-gray-600 text-center mb-8">Manage your wholesale business efficiently</p>
          
          <Card>
            <CardHeader className="text-center">
              <UserCheck className="mx-auto h-12 w-12 text-primary mb-2" />
              <CardTitle>Brand Account</CardTitle>
              <CardDescription>Access your brand management dashboard</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-sm">Manage your resellers, inventory, orders and more.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild className="w-full">
                <Link to="/brand/login">
                  Login to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
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

export default BrandPortal;

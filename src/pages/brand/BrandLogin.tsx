
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { toast } from '@/hooks/use-toast';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const BrandLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      // Set authentication flag in local storage for demo purposes
      localStorage.setItem('brand_authenticated', 'true');
      
      // Show success toast
      toast({
        title: 'Login successful',
        description: 'Redirecting to your dashboard...',
        duration: 3000,
      });
      
      // Navigate to dashboard
      navigate('/brand/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Sign in to your Brand account"
      description="Enter your credentials to access your wholesale management dashboard"
      portalType="brand"
      footerContent={
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/brand/signup" className="text-primary hover:text-primary/80 hover:underline">
            Sign up
          </Link>
        </div>
      }
    >
      {/* Custom login form with demo functionality */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            placeholder="your@email.com" 
            type="email" 
            required 
            autoComplete="email"
            defaultValue="demo@bndbox.com"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              to="/reset-password" 
              className="text-sm text-primary hover:text-primary/80 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            required
            autoComplete="current-password"
            defaultValue="demo123"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me for 30 days
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Demo access: Use the pre-filled credentials to explore the brand portal.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default BrandLogin;

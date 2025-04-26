
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { toast } from '@/hooks/use-toast';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const ResellerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("demo@resellerbox.com");
  const [password, setPassword] = useState("demo123");
  const [rememberMe, setRememberMe] = useState(false);

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      // Set authentication flag in local storage for demo purposes
      localStorage.setItem('reseller_authenticated', 'true');
      
      // Show success toast
      toast({
        title: 'Login successful',
        description: 'Redirecting to your dashboard...',
        duration: 3000,
      });
      
      // Navigate to dashboard
      navigate('/reseller/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Sign in to your Reseller account"
      description="Enter your credentials to access your wholesale purchasing dashboard"
      portalType="reseller"
      footerContent={
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/reseller/signup" className="text-primary hover:text-primary/80 hover:underline">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
          />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me for 30 days
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Demo access: Use the pre-filled credentials to explore the reseller portal.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResellerLogin;

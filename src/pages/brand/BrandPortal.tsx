
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const BrandPortal = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // This would normally check authentication status
    const checkAuth = () => {
      // Simulating auth check - in a real app, this would verify the user's authentication status
      const isAuthenticated = localStorage.getItem('brand_authenticated') === 'true';
      
      if (isAuthenticated) {
        navigate('/brand/dashboard');
      } else {
        navigate('/brand/login');
      }
      
      setIsLoading(false);
    };
    
    // Short timeout to simulate checking auth status
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      {isLoading && (
        <div className="flex flex-col items-center gap-2 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your brand portal...</p>
        </div>
      )}
    </div>
  );
};

export default BrandPortal;

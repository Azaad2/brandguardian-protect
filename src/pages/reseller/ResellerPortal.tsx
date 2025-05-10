
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ResellerPortal = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the reseller hub (application form) instead of login
    navigate('/reseller-hub');
    
    // Show toast explaining the redirection
    toast({
      title: "Reseller Portal Access",
      description: "Please complete the application form to request portal access.",
      duration: 5000,
    });
  }, [navigate]);
  
  return <div>Redirecting to application form...</div>;
};

export default ResellerPortal;

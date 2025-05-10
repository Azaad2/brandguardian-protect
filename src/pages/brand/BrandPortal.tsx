
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const BrandPortal = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the homepage contact section instead of login
    navigate('/#contact');
    
    // Show toast explaining the redirection
    toast({
      title: "Brand Portal Access",
      description: "Please submit the contact form to request brand portal access.",
      duration: 5000,
    });
  }, [navigate]);
  
  return <div>Redirecting to contact form...</div>;
};

export default BrandPortal;

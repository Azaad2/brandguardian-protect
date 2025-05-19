
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrandPortal = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect directly to login page instead of contact form
    navigate('/brand/login');
  }, [navigate]);
  
  return <div>Redirecting to brand login...</div>;
};

export default BrandPortal;

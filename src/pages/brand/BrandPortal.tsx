
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BrandPortal = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the login page
    navigate('/brand/login');
  }, [navigate]);
  
  return <div>Redirecting to login...</div>;
};

export default BrandPortal;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResellerPortal = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the login page
    navigate('/reseller/login');
  }, [navigate]);
  
  return <div>Redirecting to login...</div>;
};

export default ResellerPortal;

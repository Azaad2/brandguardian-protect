
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const PortalSwitcher = () => {
  const navigate = useNavigate();
  
  const navigateToPortal = (portal: 'brand' | 'reseller' | 'admin') => {
    navigate(`/${portal}/dashboard`);
    toast({
      title: `Switched to ${portal} portal`,
      description: `You are now viewing the ${portal} dashboard`,
    });
  };
  
  return (
    <div className="fixed top-16 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Testing: Switch Portal</h3>
      <div className="flex flex-col gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigateToPortal('brand')}
        >
          Brand Portal
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigateToPortal('reseller')}
        >
          Reseller Portal
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigateToPortal('admin')}
        >
          Admin Portal
        </Button>
      </div>
    </div>
  );
};

export default PortalSwitcher;

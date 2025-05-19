
import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ResellerOverview from '@/components/reseller/ResellerOverview';
import ResellerBrands from '@/components/reseller/ResellerBrands';
import ResellerOrders from '@/components/reseller/ResellerOrders';
import ResellerShipments from '@/components/reseller/ResellerShipments';
import ResellerMessages from '@/components/reseller/ResellerMessages';
import ResellerAnalytics from '@/components/reseller/ResellerAnalytics';
import ResellerSettings from '@/components/reseller/ResellerSettings';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -10
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: 10
  }
};

const pageTransition = {
  type: "tween",
  duration: 0.3
};

const ResellerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not a reseller
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the reseller dashboard",
        variant: "destructive"
      });
      navigate("/reseller/login");
    } else if (!isLoading && user && userRole !== 'reseller') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only accessible to resellers",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [user, userRole, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || userRole !== 'reseller') {
    return null;
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route
          index
          element={
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
                className="w-full"
              >
                <ResellerOverview />
              </motion.div>
            </AnimatePresence>
          }
        />
        <Route path="brands" element={<ResellerBrands />} />
        <Route path="orders" element={<ResellerOrders />} />
        <Route path="shipments" element={<ResellerShipments />} />
        <Route path="messages" element={<ResellerMessages />} />
        <Route path="analytics" element={<ResellerAnalytics />} />
        <Route path="settings" element={<ResellerSettings />} />
        <Route path="*" element={<Navigate to="/reseller" replace />} />
      </Route>
    </Routes>
  );
};

export default ResellerDashboard;

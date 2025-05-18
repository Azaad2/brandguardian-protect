
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ResellerOverview from '@/components/reseller/ResellerOverview';
import ResellerBrands from '@/components/reseller/ResellerBrands';
import ResellerOrders from '@/components/reseller/ResellerOrders';
import ResellerShipments from '@/components/reseller/ResellerShipments';
import ResellerMessages from '@/components/reseller/ResellerMessages';
import ResellerAnalytics from '@/components/reseller/ResellerAnalytics';
import ResellerSettings from '@/components/reseller/ResellerSettings';

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
      </Route>
    </Routes>
  );
};

export default ResellerDashboard;

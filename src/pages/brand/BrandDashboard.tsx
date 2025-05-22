
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BrandOverview from '@/components/brand/BrandOverview';
import BrandResellers from '@/components/brand/BrandResellers';
import BrandInventory from '@/components/brand/BrandInventory';
import BrandOrders from '@/components/brand/BrandOrders';
import BrandAlerts from '@/components/brand/BrandAlerts';
import BrandMessages from '@/components/brand/BrandMessages';
import BrandAnalytics from '@/components/brand/BrandAnalytics';
import BrandSettings from '@/components/brand/BrandSettings';
import BrandListings from '@/components/brand/BrandListings';
import BrandComplianceMonitor from '@/components/brand/BrandComplianceMonitor';
import BrandReports from '@/components/brand/BrandReports';

const BrandDashboard = () => {
  const location = useLocation();
  
  // Log the current route for debugging
  console.log("Brand Dashboard rendering with path:", location.pathname);
  
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<BrandOverview />} />
        <Route path="resellers" element={<BrandResellers />} />
        <Route path="inventory" element={<BrandInventory />} />
        <Route path="orders" element={<BrandOrders />} />
        <Route path="alerts" element={<BrandAlerts />} />
        <Route path="messages" element={<BrandMessages />} />
        <Route path="analytics" element={<BrandAnalytics />} />
        <Route path="settings" element={<BrandSettings />} />
        <Route path="listings" element={<BrandListings />} />
        <Route path="compliance" element={<BrandComplianceMonitor />} />
        <Route path="reports" element={<BrandReports />} />
        
        {/* Add a catch-all route to redirect any unknown paths */}
        <Route path="*" element={<Navigate to="/brand/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default BrandDashboard;

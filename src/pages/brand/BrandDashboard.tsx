
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BrandOverview from '@/components/brand/BrandOverview';
import BrandResellers from '@/components/brand/BrandResellers';
import BrandInventory from '@/components/brand/BrandInventory';
import BrandOrders from '@/components/brand/BrandOrders';
import BrandAlerts from '@/components/brand/BrandAlerts';
import BrandMessages from '@/components/brand/BrandMessages';
import BrandAnalytics from '@/components/brand/BrandAnalytics';
import BrandSettings from '@/components/brand/BrandSettings';

const BrandDashboard = () => {
  return (
    <DashboardLayout userRole="brand">
      <Routes>
        <Route index element={<BrandOverview />} />
        <Route path="resellers" element={<BrandResellers />} />
        <Route path="inventory" element={<BrandInventory />} />
        <Route path="orders" element={<BrandOrders />} />
        <Route path="alerts" element={<BrandAlerts />} />
        <Route path="messages" element={<BrandMessages />} />
        <Route path="analytics" element={<BrandAnalytics />} />
        <Route path="settings" element={<BrandSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default BrandDashboard;

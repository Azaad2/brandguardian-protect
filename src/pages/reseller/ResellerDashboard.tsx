
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ResellerOverview from '@/components/reseller/ResellerOverview';
import ResellerOrders from '@/components/reseller/ResellerOrders';
import ResellerBrands from '@/components/reseller/ResellerBrands';
import ResellerCatalogs from '@/components/reseller/ResellerCatalogs';
import ResellerMessages from '@/components/reseller/ResellerMessages';
import ResellerShipments from '@/components/reseller/ResellerShipments';
import ResellerSettings from '@/components/reseller/ResellerSettings';
import ResellerAnalytics from '@/components/reseller/ResellerAnalytics';

const ResellerDashboard = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<ResellerOverview />} />
        <Route path="orders" element={<ResellerOrders />} />
        <Route path="brands" element={<ResellerBrands />} />
        <Route path="catalogs" element={<ResellerCatalogs />} />
        <Route path="messages" element={<ResellerMessages />} />
        <Route path="shipments" element={<ResellerShipments />} />
        <Route path="analytics" element={<ResellerAnalytics />} />
        <Route path="settings" element={<ResellerSettings />} />
        <Route path="*" element={<Navigate to="/reseller/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default ResellerDashboard;

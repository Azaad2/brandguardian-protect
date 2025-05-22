
import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import ResellerRegistration from './ResellerRegistration';
import CatalogApprovals from '@/components/admin/CatalogApprovals';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="reseller-registration" element={<ResellerRegistration />} />
        <Route path="catalog-management" element={<CatalogApprovals />} />
        {/* Add more admin routes as needed */}
      </Route>
    </Routes>
  );
};

export default AdminDashboard;

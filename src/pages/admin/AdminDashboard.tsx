
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import ResellerRegistration from './ResellerRegistration';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="reseller-registration" element={<ResellerRegistration />} />
        {/* Add more admin routes as needed */}
      </Route>
    </Routes>
  );
};

export default AdminDashboard;

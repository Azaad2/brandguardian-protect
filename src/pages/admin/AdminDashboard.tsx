
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminOverview from "@/components/admin/AdminOverview";
import BrandsDirectory from "@/components/admin/BrandsDirectory";
import CatalogApprovals from "@/components/admin/CatalogApprovals";
import UserManagement from "@/pages/admin/UserManagement";
import ResellerRegistration from "@/pages/admin/ResellerRegistration";
import AuthGuard from "@/components/auth/AuthGuard";

const AdminDashboard = () => {
  return (
    <AuthGuard requiredRole="admin" bypassAuth={false}>
      <Routes>
        <Route path="/*" element={
          <DashboardLayout />
        }>
          <Route index element={<AdminOverview />} />
          <Route path="reseller-applications" element={<ResellerRegistration />} />
          <Route path="brands-directory" element={<BrandsDirectory />} />
          <Route path="catalog-approvals" element={<CatalogApprovals />} />
          <Route path="user-management" element={<UserManagement />} />
        </Route>
      </Routes>
    </AuthGuard>
  );
};

export default AdminDashboard;

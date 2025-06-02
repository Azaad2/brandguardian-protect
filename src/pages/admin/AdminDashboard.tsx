
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminOverview from "@/components/admin/AdminOverview";
import ResellerApplicationTable from "@/components/admin/ResellerApplicationTable";
import BrandsDirectory from "@/components/admin/BrandsDirectory";
import CatalogApprovals from "@/components/admin/CatalogApprovals";
import UserManagement from "@/pages/admin/UserManagement";

const AdminDashboard = () => {
  return (
    <DashboardLayout userRole="admin">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="reseller-applications" element={<ResellerApplicationTable />} />
        <Route path="brands-directory" element={<BrandsDirectory />} />
        <Route path="catalog-approvals" element={<CatalogApprovals />} />
        <Route path="user-management" element={<UserManagement />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;


import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BrandOverview from "@/components/brand/BrandOverview";
import BrandInventory from "@/components/brand/BrandInventory";
import BrandResellers from "@/components/brand/BrandResellers";
import BrandOrders from "@/components/brand/BrandOrders";
import BrandMessages from "@/components/brand/BrandMessages";
import BrandAnalytics from "@/components/brand/BrandAnalytics";
import BrandSettings from "@/components/brand/BrandSettings";

const BrandDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<BrandOverview />} />
        <Route path="inventory" element={<BrandInventory />} />
        <Route path="resellers" element={<BrandResellers />} />
        <Route path="orders" element={<BrandOrders />} />
        <Route path="messages" element={<BrandMessages />} />
        <Route path="analytics" element={<BrandAnalytics />} />
        <Route path="settings" element={<BrandSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default BrandDashboard;

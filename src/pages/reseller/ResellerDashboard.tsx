
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResellerOverview from "@/components/reseller/ResellerOverview";
import ResellerBrands from "@/components/reseller/ResellerBrands";
import ResellerOrders from "@/components/reseller/ResellerOrders";
import ResellerMessages from "@/components/reseller/ResellerMessages";
import ResellerSettings from "@/components/reseller/ResellerSettings";

const ResellerDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<ResellerOverview />} />
        <Route path="brands" element={<ResellerBrands />} />
        <Route path="orders" element={<ResellerOrders />} />
        <Route path="messages" element={<ResellerMessages />} />
        <Route path="settings" element={<ResellerSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ResellerDashboard;

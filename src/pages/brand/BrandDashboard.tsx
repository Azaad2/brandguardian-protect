
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const BrandDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default BrandDashboard;

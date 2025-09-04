
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const ResellerDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ResellerDashboard;

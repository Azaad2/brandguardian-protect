
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="w-full min-h-full">
        <Outlet />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

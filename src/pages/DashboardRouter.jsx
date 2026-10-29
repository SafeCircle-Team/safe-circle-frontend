import { useAuth } from "../context/AuthContext";
import Dashboard from "./Dashboard";
import Community from "./Community";
import SuperAdminDashboard from "./SuperAdminDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === "SUPER_ADMIN") {
    return <SuperAdminDashboard />;
  }

  if (user?.role === "COMMUNITY_ADMIN") {
    return <Community />;
  }

  return <Dashboard />;
};

export default DashboardRouter;
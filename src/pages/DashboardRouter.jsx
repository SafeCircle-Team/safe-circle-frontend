// import { useAuth } from "../context/AuthContext";
// import Dashboard from "./Dashboard";
// import Community from "./Community";

// const DashboardRouter = () => {
//   const { user } = useAuth();

//   if (user?.role === "COMMUNITY_ADMIN") {
//     return <Community />;
//   }

//   return <Dashboard />;
// };

// export default DashboardRouter;

import { useAuth } from "../context/AuthContext";
import Dashboard from "./Dashboard";
import Community from "./Community";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === "COMMUNITY_ADMIN") {
    return <Community />;
  }

  return <Dashboard />;
};

export default DashboardRouter;
import RoleRoute from "./components/RoleRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoutes";
import DashboardRouter from "./pages/DashboardRouter";
import EmergencyContacts from "./pages/EmergencyContacts";
import Notifications from "./pages/Notifications";
import Emergency from "./pages/Emergency";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Residents from "./pages/Residents";
import Communities from "./pages/management/Communities";
import Users from "./pages/management/Users";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/contacts" element={<EmergencyContacts />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/emergency" element={<Emergency />} />

          <Route element={<RoleRoute allowedRoles={["COMMUNITY_ADMIN"]} />}>
          <Route path="/community" element={<Community />} />
          </Route>

          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route element={<RoleRoute allowedRoles={["COMMUNITY_ADMIN"]} />}>
          <Route path="/residents" element={<Residents />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/management/communities"
          element={<Communities/>}/>
          <Route path="/management/users" element={<Users />}/>
          </Route>
        </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
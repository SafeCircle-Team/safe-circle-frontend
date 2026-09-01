import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import EmergencyContacts from "./pages/EmergencyContacts";
import Notifications from "./pages/Notifications";
import Emergency from "./pages/Emergency";
import Community from "./pages/Community";
import Profile from "./pages/Profile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<EmergencyContacts />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
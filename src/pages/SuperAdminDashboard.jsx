import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const SuperAdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();

        console.log("SuperAdmin Dashboard:", response);

        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Super Admin Dashboard
      </h1>

      <pre className="mt-6 bg-gray-100 p-4 rounded">
        {JSON.stringify(dashboard, null, 2)}
      </pre>
    </div>
  );
};

export default SuperAdminDashboard;
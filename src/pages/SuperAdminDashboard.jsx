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

  const getActivityMessage = (activity) => {
    const userName = `${activity.user?.firstName || ""} ${
      activity.user?.lastName || ""
    }`.trim();

    if (activity.action === "CREATE") {
      return `${userName} created a ${activity.entity}`;
    }

    if (activity.action === "UPDATE") {
      return `${userName} updated a ${activity.entity}`;
    }

    if (activity.action === "DELETE") {
      return `${userName} deleted a ${activity.entity}`;
    }

    if (activity.action === "LOGIN") {
      return `${userName} logged in`;
    }

    return `${userName} performed ${activity.action} on ${activity.entity}`;
  };

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage the SafeCircle platform.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Platform Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Total Communities</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.totalCommunities}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Registered communities</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Active Communities</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.activeCommunities}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Currently active</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">New Communities Today</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.newCommunitiesToday}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Registered today</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Total Users</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.totalUsers}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Registered platform users
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Active Users</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.activeUsers}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Currently active</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">New Users Today</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.newUsersToday}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Registered today</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Emergency Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Total Emergencies</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.totalEmergencies}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              All reported emergencies
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Open Emergencies</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.openEmergencies}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Awaiting resolution</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Critical Emergencies</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.criticalEmergencies}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Critical priority alerts
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Resolved Emergencies</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.resolvedEmergencies}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Successfully resolved</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Incident Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Total Incidents</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.totalIncidents}
            </h2>

            <p className="text-xs text-gray-400 mt-2">All reported incidents</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Open Incidents</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.activeIncidents}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Awaiting resolution</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Resolved Incidents</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.resolvedIncidents}
            </h2>

            <p className="text-xs text-gray-400 mt-2">Successfully resolved</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Subscription Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">
              Active Community Subscriptions
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {dashboard.activeSubscriptions}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Communities with an active plan
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">Plans</p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Basic</span>
                <span className="font-semibold text-gray-800">
                  {dashboard.basicSubscriptions}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Standard</span>
                <span className="font-semibold text-gray-800">
                  {dashboard.standardSubscriptions}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Enterprise</span>
                <span className="font-semibold text-gray-800">
                  {dashboard.enterpriseSubscriptions}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Active subscriptions by plan
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-500">SMS Balance</p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Community SMS</span>
                <span className="font-semibold text-gray-800">
                  {dashboard.communitySmsRemaining}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Personal SMS</span>
                <span className="font-semibold text-gray-800">
                  {dashboard.personalSmsRemaining}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">Remaining SMS credits</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Subscriptions Requiring Attention
          </h2>

          <span className="text-sm text-gray-500">Expiring within 30 days</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {dashboard.expiringSubscriptions.length === 0 ? (
            <div className="p-5 text-sm text-gray-500">
              No subscriptions are expiring within the next 30 days.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-gray-600">
                      Community
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-600">
                      Plan
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-600">
                      Expires
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.expiringSubscriptions.map((subscription) => (
                    <tr
                      key={subscription.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-medium text-gray-800">
                        {subscription.community.name}
                      </td>

                      <td className="px-5 py-3 text-gray-600">
                        {subscription.subscriptionPlan.name}
                      </td>

                      <td className="px-5 py-3 text-gray-600">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Communities
          </h2>

          <span className="text-sm text-gray-500">
            Latest registered communities
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Community
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Ward
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">LGA</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    State
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.latestCommunities.map((community) => (
                  <tr
                    key={community.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {community.name}
                    </td>

                    <td className="px-5 py-3 text-gray-600">
                      {community.ward}
                    </td>

                    <td className="px-5 py-3 text-gray-600">{community.lga}</td>

                    <td className="px-5 py-3 text-gray-600">
                      {community.state}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>

          <span className="text-sm text-gray-500">Latest registered users</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Phone
                  </th>

                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Community
                  </th>

                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.latestUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-3 font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </td>

                    <td className="px-5 py-3 text-gray-600">{user.phone}</td>

                    <td className="px-5 py-3 text-gray-600">
                      {user.community?.name || "—"}
                    </td>

                    <td className="px-5 py-3 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Platform Activity
          </h2>

          <span className="text-sm text-gray-500">
            Latest administrative activity
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="divide-y">
            {dashboard.recentActivity.map((activity) => (
              <div key={activity.id} className="p-5 flex items-start gap-4">
                <div className="mt-2 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <p className="font-medium text-gray-800">
                      {activity.user?.firstName} {activity.user?.lastName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {getActivityMessage(activity)}
                  </p>

                  {activity.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-800">Manage Communities</h3>

            <p className="text-sm text-gray-500 mt-2">
              View and manage registered communities.
            </p>

            <button
              type="button"
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Communities →
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-800">Manage Users</h3>

            <p className="text-sm text-gray-500 mt-2">
              View and manage users across the platform.
            </p>

            <button
              type="button"
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Users →
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-800">System Settings</h3>

            <p className="text-sm text-gray-500 mt-2">
              Configure platform-wide settings.
            </p>

            <button
              type="button"
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Open Settings →
            </button>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-800">Subscriptions</h3>

            <p className="text-sm text-gray-500 mt-2">
              Manage community subscription plans.
            </p>

            <button
              type="button"
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage Plans →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

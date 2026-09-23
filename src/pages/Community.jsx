import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCommunity } from "../services/communityService";

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCommunity(user.communityId);

        setCommunity(response.data);
        console.log("Community data:", response.data);
      
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!user?.communityId) {
      return;
    }

    fetchCommunity();
  }, [user?.communityId]);

  if (loading) {
    return <p className="text-gray-600">Loading community...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  // Community statistics
  const totalMembers = community?.users?.length || 0;

  const activeMembers =
    community?.users?.filter(
      (user) => user.status === "ACTIVE"
    ).length || 0;

  const inactiveMembers =
    community?.users?.filter(
      (user) => user.status !== "ACTIVE"
    ).length || 0;

  const totalResidents =
    community?.users?.filter(
    (user) => user.role?.roleType === "RESIDENT"
  ).length || 0;

  const totalSecurityPersonnel =
    community?.users?.filter(
    (user) => user.role?.roleType === "SECURITY_PERSONNEL"
  ).length || 0;

  const totalEmergencies =
    community?.emergencies?.length || 0;

  const openEmergencies =
    community?.emergencies?.filter(
      (emergency) => emergency.status === "OPEN"
    ).length || 0;

  const criticalEmergencies =
    community?.emergencies?.filter(
      (emergency) => emergency.priority === "CRITICAL"
    ).length || 0;

  const resolvedEmergencies =
    community?.emergencies?.filter(
      (emergency) => emergency.status === "RESOLVED"
    ).length || 0;

  const recentEmergencies =
    community?.emergencies
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 5) || []; 

    const recentActivities =
      community?.auditLogs || [];
    
    const subscription =
  community?.communitySubscriptions?.[0];

const subscriptionPlan =
  subscription?.subscriptionPlan;

const subscriptionStartDate =
  subscription?.startDate
    ? new Date(subscription.startDate).toLocaleDateString()
    : "N/A";

const subscriptionEndDate =
  subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString()
    : "N/A";

  return (
    <div>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Community Dashboard
        </h1>

        <p className="mt-1 text-gray-600">
          Overview of your community activities and security.
        </p>
      </div>

      {/* Community Information */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          {community?.name}
        </h2>

        <p className="mt-2 text-gray-600">
          {community?.address}
        </p>
      </div>

{/* Subscription Information */}
<div className="mt-6 rounded-lg bg-white p-6 shadow-sm">

  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold text-gray-800">
        Subscription
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Current subscription plan for your community.
      </p>
    </div>

    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        subscription?.status === "ACTIVE"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {subscription?.status || "NO SUBSCRIPTION"}
    </span>
  </div>

  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

    <div>
      <p className="text-sm text-gray-500">
        Plan
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {subscriptionPlan?.name || "N/A"}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Annual Price
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        ₦{Number(subscriptionPlan?.annualPrice || 0).toLocaleString()}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Start Date
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {subscriptionStartDate}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Expiry Date
      </p>

      <p className="mt-1 font-semibold text-gray-800">
        {subscriptionEndDate}
      </p>
    </div>

  </div>

  <div className="mt-5 border-t pt-4">
    <p className="text-sm text-gray-500">
      {subscriptionPlan?.description ||
        "No subscription plan description."}
    </p>
  </div>

</div>

    {/* Community Statistics */}
<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

  {/* Members */}
  <div className="rounded-lg bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Community Members
    </p>

    <p className="mt-2 text-3xl font-bold text-gray-800">
      {totalMembers}
    </p>

    <p className="mt-2 text-sm text-gray-500">
      {activeMembers} active · {inactiveMembers} inactive
    </p>
  </div>

  {/* Residents */}
  <div className="rounded-lg bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Residents
    </p>

    <p className="mt-2 text-3xl font-bold text-gray-800">
      {totalResidents}
    </p>

    <p className="mt-2 text-sm text-gray-500">
      Community residents
    </p>
  </div>

  {/* Security Personnel */}
  <div className="rounded-lg bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Security Personnel
    </p>

    <p className="mt-2 text-3xl font-bold text-gray-800">
      {totalSecurityPersonnel}
    </p>

    <p className="mt-2 text-sm text-gray-500">
      Security personnel
    </p>
  </div>

  {/* Emergencies */}
  <div className="rounded-lg bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Total Emergencies
    </p>

    <p className="mt-2 text-3xl font-bold text-gray-800">
      {totalEmergencies}
    </p>

    <p className="mt-2 text-sm text-gray-500">
      {openEmergencies} open · {criticalEmergencies} critical ·{" "}
      {resolvedEmergencies} resolved
    </p>
  </div>

</div>
      {/* Recent Emergencies */}
<div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold text-gray-800">
        Recent Emergencies
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        The latest emergency reports in your community.
      </p>
    </div>
  </div>

  {recentEmergencies.length === 0 ? (
    <p className="mt-6 text-gray-500">
      No emergencies have been reported.
    </p>
  ) : (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-sm text-gray-500">
            <th className="pb-3 font-medium">
              Type
            </th>

            <th className="pb-3 font-medium">
              Priority
            </th>

            <th className="pb-3 font-medium">
              Status
            </th>

            <th className="pb-3 font-medium">
              Reported By
            </th>

            <th className="pb-3 font-medium">
              Date
            </th>
          </tr>
        </thead>

        <tbody>
  {recentEmergencies.map((emergency) => (
    <tr
      key={emergency.id}
      className="border-b last:border-b-0"
    >
      <td className="py-4 font-medium text-gray-800">
        {emergency.emergencyType}
      </td>

      <td className="py-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      emergency.priority === "CRITICAL"
        ? "bg-red-100 text-red-700"
        : emergency.priority === "HIGH"
        ? "bg-orange-100 text-orange-700"
        : emergency.priority === "MEDIUM"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {emergency.priority}
  </span>
</td>

<td className="py-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      emergency.status === "OPEN"
        ? "bg-orange-100 text-orange-700"
        : emergency.status === "RESOLVED"
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {emergency.status}
  </span>
</td>

      <td className="py-4 text-gray-600">
        {emergency.reportedBy?.firstName}{" "}
        {emergency.reportedBy?.lastName}
      </td>

      <td className="py-4 text-gray-600">
        {new Date(
          emergency.createdAt
        ).toLocaleDateString()}
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  )}
</div>

{/* Recent Activity + Quick ACtion*/}
<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* Recent Activity */}
  <div className="rounded-lg bg-white p-6 shadow-sm">

  <div>
    <h2 className="text-lg font-semibold text-gray-800">
      Recent Activity
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Recent administrative activities in your community.
    </p>
  </div>

  {recentActivities.length === 0 ? (
    <p className="mt-6 text-gray-500">
      No recent activity.
    </p>
  ) : (
    <div className="mt-6 space-y-5">

      {recentActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3"
        >

          {/* Activity Indicator */}
          <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gray-400" />

          {/* Activity Details */}
          <div className="min-w-0 flex-1">

            <p className="font-medium text-gray-800">
              {activity.description ||
                `${activity.action} ${activity.entity}`}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">

              <span>
                By {activity.user?.firstName}{" "}
                {activity.user?.lastName}
              </span>

              <span>•</span>

              <span>
                {new Date(activity.createdAt).toLocaleDateString()}
              </span>

            </div>

          </div>

        </div>
      ))}

    </div>
  )}

</div>

{/* Quick Actions */}
<div className="rounded-lg bg-white p-6 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-800">
    Quick Actions
  </h2>

  <p className="mt-1 text-sm text-gray-500">
    Quickly access important community features.
  </p>

  <div className="mt-6 grid grid-cols-1 gap-3">
    
    <button
      onClick={() => navigate("/emergency")}
      className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
    >
      <h3 className="font-semibold text-gray-800">
        View Emergencies
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        View and manage community emergencies.
      </p>
    </button>

    <button
      onClick={() => navigate("/contacts")}
      className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
    >
      <h3 className="font-semibold text-gray-800">
        Emergency Contacts
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Manage emergency contacts.
      </p>
    </button>

    <button
      onClick={() => navigate("/notifications")}
      className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
    >
      <h3 className="font-semibold text-gray-800">
        Notifications
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        View community notifications.
      </p>
    </button>

    <button
      onClick={() => navigate("/profile")}
      className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
    >
      <h3 className="font-semibold text-gray-800">
        My Profile
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        View and update your profile.
      </p>
    </button>

    <button
  onClick={() => navigate("/residents")}
  className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
>
  <h3 className="font-semibold text-gray-800">
    Manage Residents
  </h3>

  <p className="mt-1 text-sm text-gray-500">
    View and manage community residents.
  </p>
</button>

  </div>
</div>
</div>
    </div>
  );
};

export default Community;
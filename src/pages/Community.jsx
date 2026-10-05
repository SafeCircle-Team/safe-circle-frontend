import { getSubscriptionPlans } from "../services/subscriptionPlanService";
import { createPayment } from "../services/paymentService";
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCommunity } from "../services/communityService";
import { getSmsBundles, getCommunitySmsBalance } from "../services/smsBundleService";
import { getCommunityWalletBalance } from "../services/walletService";


const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [communitySmsBalance, setCommunitySmsBalance] = useState(null);
  const [smsLoading, setSmsLoading] = useState(true);;
  const [smsError, setSmsError] = useState("");

  const [smsBundles, setSmsBundles] = useState([]);
  const [smsBundlesLoading, setSmsBundlesLoading] = useState(true);
  const [selectedSmsBundle, setSelectedSmsBundle] = useState("");
  const [smsBundlesError, setSmsBundlesError] = useState(null);

  const [communityWallet, setCommunityWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");

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

  useEffect(() => {
  const fetchSubscriptionPlans = async () => {
    try {
      setPlansLoading(true);
      setPlansError("");

      const response = await getSubscriptionPlans();

      setSubscriptionPlans(response.data);
    } catch (error) {
      setPlansError(error.message);
    } finally {
      setPlansLoading(false);
    }
  };

  fetchSubscriptionPlans();
}, []);

useEffect(() => {
  const fetchCommunitySmaBalance = async () => {
    try {
      setSmsLoading(true);
      setSmsError("");

      const response = await getCommunitySmsBalance();

      setCommunitySmsBalance(response.data);

    } catch (error) {
      setSmsError(error.message);
    } finally {
      setSmsLoading(false);
    }
  };

  if (!user?.communityId)
  return;

  fetchCommunitySmaBalance();
}, [user?.communityId]
), 

useEffect(() => {
  const fetchSmsBundles = async () => {
    try {
      setSmsBundlesLoading(true);
      setSmsBundlesError("");

      const response = await getSmsBundles();

      setSmsBundles(response.data);

    } catch (error) {
      setSmsBundlesError(error.message)
    }finally {
      setSmsBundlesLoading(false);
    }
  };
  
  fetchSmsBundles();
}, []);

useEffect(() => {
  const fetchCommunityWallet = async () => {
    try {
      setWalletLoading(true);
      setWalletError("");

      const response = await getCommunityWalletBalance();
      console.log("Community Wallet:", response.data);

      setCommunityWallet(response.data);
    } catch (error) {
      setWalletError(error.message);
    }finally {
      setWalletLoading(false);
    }
    
  };
    if (!user?.communityId) {
      return;
    }

    fetchCommunityWallet();
  
  }, [user?.communityId]);
console.log("Subscription plans:", subscriptionPlans);

  if (loading) {
    return <p className="text-gray-600">Loading community...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setPaymentError("Please select a subscription plan.")
      return;
    }
  try {
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentMessage("");

    const response = await createPayment({
      paymentMethod: "WALLET",
      purpose: "COMMUNITY_SUBSCRIPTION",
      subscriptionPlanId: selectedPlan.id,
      ownership: "COMMUNITY",
    });

    console.log("Subscription payment response:", response)

    setPaymentMessage(response.message);

    const walletResponse = await getCommunityWalletBalance();
    setCommunityWallet(walletResponse.data);

    const communityResponse = await getCommunity(user.communityId);
    setCommunity(communityResponse.data);

    setSelectedPlan(null);
  } catch (error) {
    setPaymentError(error.message);
  } finally {
    setPaymentLoading(false);
  }
};

const handleBuySms = async () => {
  console.log("Buy SMS clicked");

  if (!selectedSmsBundle) {
    setPaymentError("Please select an SMS bundle.");
    return;
  }
  try {
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentMessage("");

    const response = await createPayment({
      paymentMethod: "WALLET",
      purpose: "SMS_BUNDLE",
      smsBundleId: selectedSmsBundle.id,
      ownership: "COMMUNITY",
    });

    console.log("Payment response:", response);

    setPaymentMessage(response.message);

    const walletResponse = await getCommunityWalletBalance();
    setCommunityWallet(walletResponse.data);

    const smsResponse = await getCommunitySmsBalance();
    setCommunitySmsBalance(smsResponse.data);

    setSelectedSmsBundle(null);

  } catch (error) {
    setPaymentError(error.message);
  }finally {
    setPaymentLoading(false);
  }
};



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
      community?.auditLogs
      ?.slice()
      .sort(
        (a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5) || [];

const getActivityMessage = (activity) => {
  const userName = `${activity.user?.firstName || ""} ${
    activity.user?.lastName || ""
  }`.trim();

  if (activity.entity === "Payment" && activity.action === "CREATE") {
    return `Payment created by ${userName}`;
  }

  return `${activity.action} ${activity.entity} by ${userName}`;
  };      
    
    const subscription =
  community?.communitySubscriptions?.[0];

  const hasActiveSubscription = subscription?.status === "ACTIVE";
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

{!hasActiveSubscription && (

<div className="bg-white rounded-xl shadow-sm border p-6 mt-6">

  <div className="mb-6">
    <h2 className="text-lg font-semibold text-gray-900">
      Available Subscription Plans
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Choose a plan for your community.
    </p>
  </div>

  {plansLoading ? (
    <p className="text-sm text-gray-500">
      Loading subscription plans...
    </p>
  ) : plansError ? (
    <p className="text-sm text-red-600">
      {plansError}
    </p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {subscriptionPlans.map((plan) => (
        <div
          key={plan.id}
          onClick={() => setSelectedPlan(plan)}
          className={`border rounded-xl p-5 cursor-pointer transition ${
            selectedPlan?.id === plan.id
              ? "border-blue-600 ring-2 ring-blue-100"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-900">
            {plan.name}
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            {plan.description}
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-4">
            ₦{Number(plan.annualPrice).toLocaleString()}
            <span className="text-sm font-normal text-gray-500">
              {" "}
              / year
            </span>
          </p>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>
              Up to {plan.maxResidents.toLocaleString()} residents
            </p>

            <p>
              Up to {plan.maxSecurityUsers} security personnel
            </p>
          </div>

          <button
            type="button"
            className={`w-full mt-5 py-2 rounded-lg font-medium ${
              selectedPlan?.id === plan.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {selectedPlan?.id === plan.id
              ? "Selected"
              : "Select Plan"}
          </button>
        </div>
      ))}
    </div>
  )}

  {selectedPlan && (
  <div className="mt-6 border-t pt-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500">
          Selected plan
        </p>

        <p className="text-lg font-semibold text-gray-900">
          {selectedPlan.name}
        </p>

        <p className="text-sm text-gray-600">
          ₦{Number(selectedPlan.annualPrice).toLocaleString()} / year
        </p>
      </div>

      <div className="flex gap-3">
  <button
    type="button"
    onClick={() => setSelectedPlan(null)}
    disabled={paymentLoading}
    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={handleSubscribe}
    disabled={paymentLoading}
    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {paymentLoading ? "Initializing Payment..." : "Subscribe Now"}
  </button>
</div>
    </div>

    {paymentError && (
      <p className="mt-4 text-sm text-red-600">
        {paymentError}
      </p>
    )}

    {paymentMessage && (
      <p className="mt-4 text-sm text-green-600">
        {paymentMessage}
      </p>
    )}
  </div>
)}
</div>
)}

<div className="mt-4">
  <h2 className="text-xl font-semibold text-gray-900">
    Community Finances
  </h2>
  <p className="text-sm text-gray-500 mt-1">
    Manage the community wallet and SMS credits
  </p>
</div>
{/* Community Finances heading */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

{/* Community Wallet Balance */}
<div className="bg-white border rounded-xl p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Community Wallet
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Available community funds
      </p>
    </div>

    <span className="text-3xl">💰</span>
  </div>

  <div className="mt-8">
    {walletLoading ? (
      <p className="text-sm text-gray-500">
        Loading wallet balance...
      </p>
    ) : walletError ? (
      <p className="text-sm text-red-600">
        {walletError}
      </p>
    ) : (
      <>
        <p className="text-4xl font-bold text-gray-900">
          ₦{Number(communityWallet?.balance || 0).toLocaleString()}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Current wallet balance
        </p>
      </>
    )}
  </div>

  <div className="mt-8 border-t pt-5">
    <button
      type="button"
      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Fund Community Wallet
    </button>
  </div>
</div>


{/* Community SMS Card */}

<div className="bg-white border rounded-xl p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Community SMS
      </h3>
      <p className="text-sm text-gray-500">
        SMS credits available to the community
      </p>
    </div>

    <span className="text-2xl">📱</span>
  </div>

  {smsLoading ? (
    <p className="text-sm text-gray-500">
      Loading SMS balance...
    </p>
  ) : smsError ? (
    <p className="text-sm text-red-600">
      {smsError}
    </p>
  ) : (
    <div>
      <p className="text-4xl font-bold text-gray-900">
        {communitySmsBalance?.balance?.toLocaleString() || 0}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        SMS credits remaining
      </p>
    </div>
  )}

<div className="mt-6 border-t pt-6">
  <h4 className="text-sm font-semibold text-gray-900 mb-3">
    Buy SMS Credits
  </h4>

  {smsBundlesLoading ? (
    <p className="text-sm text-gray-500">
      Loading SMS bundles...
    </p>
  ) : smsBundlesError ? (
    <p className="text-sm text-red-600">
      {smsBundlesError}
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {smsBundles.map((bundle) => (
        <button
          key={bundle.id}
          type="button"
          onClick={() => setSelectedSmsBundle(bundle)}
          className={`text-left border rounded-lg p-4 transition ${
            selectedSmsBundle?.id === bundle.id
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-400"
          }`}
        >
          <p className="text-lg font-semibold text-gray-900">
            {bundle.smsCount.toLocaleString()}
          </p>

          <p className="text-sm text-gray-500">
            SMS credits
          </p>

          <p className="mt-2 font-medium text-gray-900">
            ₦{Number(bundle.price).toLocaleString()}
          </p>

          {selectedSmsBundle?.id === bundle.id && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              Selected
            </p>
          )}
        </button>
      ))}
    </div>
  )}
</div>
{selectedSmsBundle && (
  <div className="mt-6 border-t pt-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500">
          Selected bundle
        </p>

        <p className="text-lg font-semibold text-gray-900">
          {selectedSmsBundle.smsCount.toLocaleString()} SMS
        </p>

        <p className="text-sm text-gray-600">
          ₦{Number(selectedSmsBundle.price).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-3">
  <button
    type="button"
    onClick={() => setSelectedSmsBundle(null)}
    disabled={paymentLoading}
    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={handleBuySms}
    disabled={paymentLoading}
    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {paymentLoading ? "Initializing Payment..." : "Buy SMS"}
  </button>
</div>
   
    </div>
  </div>
)}

{paymentError && (
  <p className="mt-4 text-sm text-red-600">
    {paymentError}
  </p>
)}
{paymentMessage && (
  <p className="mt-4 text-sm text-green-600">
    {paymentMessage}
  </p>
)}
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
      Registered residents
    </p>
  </div>

  {/* Security Personnel */}
  <div className="rounded-lg bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">
      Registered Security Personnel
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
              {getActivityMessage(activity)}
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
    type="button"
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
    type="button"
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
    type="button"
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
    type="button"
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
    type="button"
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
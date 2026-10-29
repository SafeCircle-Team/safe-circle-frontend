import { getSubscriptionPlans } from "../services/subscriptionPlanService";
import { createPayment } from "../services/paymentService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCommunity, getCommunityUsers } from "../services/communityService";
import {
  getCommunityResponders,
  createCommunityResponder,
  deactivateCommunityResponder,
  checkCommunityResponderReadiness,
} from "../services/communityResponderServices";

import {
  getSmsBundles,
  getMySmsBalance,
  getCommunitySmsBalance,
} from "../services/smsBundleService";
import {
  getCommunityWalletBalance,
  getMyWalletBalance,
} from "../services/walletService";

import {
  createCommunityInvite,
  getCommunityInvites,
} from "../services/communityInviteService";

import EmergencyForm from "../components/EmergencyForm";

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
  const [smsLoading, setSmsLoading] = useState(true);
  const [smsError, setSmsError] = useState("");

  const [smsBundles, setSmsBundles] = useState([]);
  const [smsBundlesLoading, setSmsBundlesLoading] = useState(true);
  const [selectedSmsBundle, setSelectedSmsBundle] = useState("");
  const [smsBundlesError, setSmsBundlesError] = useState(null);

  // Personal SMS balance state
  const [mySmsBalance, setMySmsBalance] = useState(null);
  const [mySmsLoading, setMySmsLoading] = useState(true);
  const [mySmsError, setMySmsError] = useState("");

  const [communityWallet, setCommunityWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");

  // Personal wallet state
  const [myWallet, setMyWallet] = useState(null);
  const [myWalletLoading, setMyWalletLoading] = useState(true);
  const [myWalletError, setMyWalletError] = useState("");

// Personal wallet funding state
const [personalWalletFundingAmount, setPersonalWalletFundingAmount] =
  useState("");

const [personalWalletFundingLoading, setPersonalWalletFundingLoading] =
  useState(false);

const [personalWalletFundingError, setPersonalWalletFundingError] =
  useState("");

const [personalWalletFundingMessage, setPersonalWalletFundingMessage] =
  useState("");


  const [invites, setInvites] = useState([]);
  const [invitesLoading, setInvitesLoading] = useState(true);
  const [invitesError, setInvitesError] = useState("");

  const [inviteExpiry, setInviteExpiry] = useState("");
  const [inviteMaxUses, setInviteMaxUses] = useState("");
  const [inviteCreating, setInviteCreating] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteCreateError, setInviteCreateError] = useState("");

  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencySuccess, setEmergencySuccess] = useState("");

  // Community responder management
  const [communityUsers, setCommunityUsers] = useState([]);
  const [communityResponders, setCommunityResponders] = useState([]);
  const [responderReadiness, setResponderReadiness] = useState(null);

  const [respondersLoading, setRespondersLoading] = useState(true);
  const [respondersError, setRespondersError] = useState("");
  const [responderSuccess, setResponderSuccess] = useState("");

  const [selectedResponderType, setSelectedResponderType] = useState("");
  const [selectedResponderUserId, setSelectedResponderUserId] = useState("");

  const [assigningResponder, setAssigningResponder] = useState(false);
  const [deactivatingResponderId, setDeactivatingResponderId] = useState(null);

  // Personal SMS purchase state
  const [selectedPersonalSmsBundle, setSelectedPersonalSmsBundle] =
    useState(null);

  const [personalSmsPaymentLoading, setPersonalSmsPaymentLoading] =
    useState(false);

  const [personalSmsPaymentError, setPersonalSmsPaymentError] = useState("");

  const [personalSmsPaymentMessage, setPersonalSmsPaymentMessage] =
    useState("");

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
    const fetchInvites = async () => {
      try {
        setInvitesLoading(true);
        setInvitesError("");

        const response = await getCommunityInvites();

        setInvites(response.data);
      } catch (error) {
        setInvitesError(error.message);
      } finally {
        setInvitesLoading(false);
      }
    };
    fetchInvites();
  }, []);

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

  // Fetch Community Sms Balance
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

    if (!user?.communityId) return;

    fetchCommunitySmaBalance();
  }, [user?.communityId]);

  // Fetch the logged-in user's personal SMS balance
  useEffect(() => {
    const fetchMySmsBalance = async () => {
      try {
        setMySmsLoading(true);
        setMySmsError("");

        const response = await getMySmsBalance();
        setMySmsBalance(response.data);
      } catch (error) {
        setMySmsError(error.message || "Failed to load personal SMS balance.");
      } finally {
        setMySmsLoading(false);
      }
    };

    fetchMySmsBalance();
  }, []);

  useEffect(() => {
    const fetchSmsBundles = async () => {
      try {
        setSmsBundlesLoading(true);
        setSmsBundlesError("");

        const response = await getSmsBundles();

        setSmsBundles(response.data);
      } catch (error) {
        setSmsBundlesError(error.message);
      } finally {
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
      } finally {
        setWalletLoading(false);
      }
    };
    if (!user?.communityId) {
      return;
    }

    fetchCommunityWallet();
  }, [user?.communityId]);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        setInvitesLoading(true);
        setInvitesError("");

        const response = await getCommunityInvites();

        setInvites(response.data);
      } catch (error) {
        setInvitesError(error.message);
      } finally {
        setInvitesLoading(false);
      }
    };

    fetchInvites();
  }, []);

  useEffect(() => {
    const fetchResponderData = async () => {
      if (!user?.communityId) {
        setRespondersError("You are not assigned to a community.");
        setRespondersLoading(false);
        return;
      }

      try {
        setRespondersLoading(true);
        setRespondersError("");

        const [usersResponse, respondersResponse, readinessResponse] =
          await Promise.all([
            getCommunityUsers(user.communityId),
            getCommunityResponders(),
            checkCommunityResponderReadiness(),
          ]);

        setCommunityUsers(usersResponse.data || []);
        setCommunityResponders(respondersResponse.data || []);
        setResponderReadiness(readinessResponse.data || null);
      } catch (error) {
        console.error("Failed to load community responders:", error);

        setRespondersError(
          error.message || "Failed to load community responder information.",
        );
      } finally {
        setRespondersLoading(false);
      }
    };

    fetchResponderData();
  }, [user?.communityId]);

  useEffect(() => {
    const fetchMyWalletBalance = async () => {
      try {
        setMyWalletLoading(true);
        setMyWalletError("");

        const response = await getMyWalletBalance();
        setMyWallet(response.data);
      } catch (error) {
        setMyWalletError(
          error.message || "Failed to load personal wallet balance",
        );
      } finally {
        setMyWalletLoading(false);
      }
    };
    fetchMyWalletBalance();
  }, []);

  console.log("Subscription plans:", subscriptionPlans);

  if (loading) {
    return <p className="text-gray-600">Loading community...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setPaymentError("Please select a subscription plan.");
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

      console.log("Subscription payment response:", response);

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
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBuyPersonalSms = async () => {
    if (!selectedPersonalSmsBundle) {
      setPersonalSmsPaymentError("Please select an SMS bundle.");
      return;
    }

    try {
      setPersonalSmsPaymentLoading(true);
      setPersonalSmsPaymentError("");
      setPersonalSmsPaymentMessage("");

      const response = await createPayment({
        paymentMethod: "WALLET",
        purpose: "SMS_BUNDLE",
        smsBundleId: selectedPersonalSmsBundle.id,
        ownership: "USER",
      });

      setPersonalSmsPaymentMessage(response.message);

      // Refresh the personal wallet balance
      const walletResponse = await getMyWalletBalance();
      setMyWallet(walletResponse.data);

      // Refresh the personal SMS balance
      const smsResponse = await getMySmsBalance();
      setMySmsBalance(smsResponse.data);

      setSelectedPersonalSmsBundle(null);
    } catch (error) {
      setPersonalSmsPaymentError(
        error.message || "Failed to purchase personal SMS credits.",
      );
    } finally {
      setPersonalSmsPaymentLoading(false);
    }
  };

  const handleCreateInvite = async (event) => {
    event.preventDefault();

    try {
      setInviteCreating(true);
      setInviteCreateError("");
      setInviteMessage("");

      const inviteData = {};

      if (inviteExpiry) {
        inviteData.expiresAt = new Date(inviteExpiry).toISOString();
      }

      if (inviteMaxUses) {
        inviteData.maxUses = Number(inviteMaxUses);
      }

      const response = await createCommunityInvite(inviteData);

      setInviteMessage(response.message || "Invite created successfully.");

      const invitesResponse = await getCommunityInvites();
      setInvites(invitesResponse.data);

      setInviteExpiry("");
      setInviteMaxUses("");
    } catch (error) {
      setInviteCreateError(error.message);
    } finally {
      setInviteCreating(false);
    }
  };

  const handleEmergencyCreated = (newEmergency) => {
    setEmergencySuccess("Emergency reported successfully!");
    setShowEmergencyForm(false);
  };

  const handleAssignResponder = async (event) => {
    event.preventDefault();

    if (assigningResponder) return;

    if (!selectedResponderType || !selectedResponderUserId) {
      setRespondersError("Please select a position and a user.");
      return;
    }

    const selectedUser = communityUsers.find(
      (communityUser) => communityUser.id === selectedResponderUserId,
    );

    if (!selectedUser || selectedUser.status !== "ACTIVE") {
      setRespondersError("Please select an active community user.");
      return;
    }

    const userRole =
      typeof selectedUser.role === "object"
        ? selectedUser.role?.roleType
        : selectedUser.role;

    if (
      selectedResponderType === "SECURITY_OFFICER" &&
      userRole !== "SECURITY_PERSONNEL"
    ) {
      setRespondersError(
        "Only security personnel can be assigned as Security Officer.",
      );
      return;
    }

    try {
      setAssigningResponder(true);
      setRespondersError("");
      setResponderSuccess("");

      await createCommunityResponder({
        userId: selectedResponderUserId,
        responderType: selectedResponderType,
      });

      // Reload the latest assignments and readiness from the backend.
      const [respondersResponse, readinessResponse] = await Promise.all([
        getCommunityResponders(),
        checkCommunityResponderReadiness(),
      ]);

      setCommunityResponders(respondersResponse.data || []);
      setResponderReadiness(readinessResponse.data || null);

      setSelectedResponderType("");
      setSelectedResponderUserId("");
      setResponderSuccess("Community responder assigned successfully.");
    } catch (error) {
      console.error("Failed to assign community responder:", error);
      setRespondersError(
        error.message || "Failed to assign community responder.",
      );
    } finally {
      setAssigningResponder(false);
    }
  };
  // Deactivation Handler

  const handleDeactivateResponder = async (responderId) => {
    if (deactivatingResponderId) return;

    const confirmed = window.confirm(
      "Are you sure you want to deactivate this responder assignment?",
    );

    if (!confirmed) return;

    try {
      setDeactivatingResponderId(responderId);
      setRespondersError("");
      setResponderSuccess("");

      await deactivateCommunityResponder(responderId);

      // Refresh assignments and readiness after deactivation.
      const [respondersResponse, readinessResponse] = await Promise.all([
        getCommunityResponders(),
        checkCommunityResponderReadiness(),
      ]);

      setCommunityResponders(respondersResponse.data || []);
      setResponderReadiness(readinessResponse.data || null);

      setResponderSuccess("Responder assignment deactivated successfully.");
    } catch (error) {
      console.error("Failed to deactivate responder:", error);
      setRespondersError(
        error.message || "Failed to deactivate responder assignment.",
      );
    } finally {
      setDeactivatingResponderId(null);
    }
  };

  // Community statistics
  const totalMembers = community?.users?.length || 0;

  const activeMembers =
    community?.users?.filter((user) => user.status === "ACTIVE").length || 0;

  const inactiveMembers =
    community?.users?.filter((user) => user.status !== "ACTIVE").length || 0;

  const totalResidents =
    community?.users?.filter((user) => user.role?.roleType === "RESIDENT")
      .length || 0;

  const totalSecurityPersonnel =
    community?.users?.filter(
      (user) => user.role?.roleType === "SECURITY_PERSONNEL",
    ).length || 0;

  const totalEmergencies = community?.emergencies?.length || 0;

  const openEmergencies =
    community?.emergencies?.filter((emergency) => emergency.status === "OPEN")
      .length || 0;

  const criticalEmergencies =
    community?.emergencies?.filter(
      (emergency) => emergency.priority === "CRITICAL",
    ).length || 0;

  const resolvedEmergencies =
    community?.emergencies?.filter(
      (emergency) => emergency.status === "RESOLVED",
    ).length || 0;

  const recentEmergencies =
    community?.emergencies
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5) || [];

  const recentActivities =
    community?.auditLogs
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5) || [];

  const getActivityMessage = (activity) => {
    const userName = `${activity.user?.firstName || ""} ${
      activity.user?.lastName || ""
    }`.trim();

    if (activity.entity === "Payment" && activity.action === "CREATE") {
      return `Payment created by ${userName}`;
    }

    return `${activity.action} ${activity.entity} by ${userName}`;
  };

  const subscription = community?.communitySubscriptions?.[0];

  const hasActiveSubscription = subscription?.status === "ACTIVE";
  const subscriptionPlan = subscription?.subscriptionPlan;

  const subscriptionStartDate = subscription?.startDate
    ? new Date(subscription.startDate).toLocaleDateString()
    : "N/A";

  const subscriptionEndDate = subscription?.endDate
    ? new Date(subscription.endDate).toLocaleDateString()
    : "N/A";

  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().slice(0, 16);
  };

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

      {/* Personal emergency reporting */}
      <section className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Emergency
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Report an emergency in your capacity as a resident.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEmergencySuccess("");
              setShowEmergencyForm((current) => !current);
            }}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            {showEmergencyForm ? "Close Form" : "Report an Emergency"}
          </button>
        </div>

        {emergencySuccess && (
          <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {emergencySuccess}
          </p>
        )}

        {showEmergencyForm && (
          <EmergencyForm onEmergencyCreated={handleEmergencyCreated} />
        )}
      </section>

      {/* Community Information */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          {community?.name}
        </h2>

        <p className="mt-2 text-gray-600">{community?.address}</p>
      </div>

      {/* Official Community Responders */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Official Community Responders
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Assign the official officers who will receive emergency alerts
              from residents in your community.
            </p>
          </div>

          {responderReadiness && (
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                responderReadiness.isReady
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {responderReadiness.isReady
                ? "All positions assigned"
                : "Setup incomplete"}
            </span>
          )}
        </div>

        {respondersLoading ? (
          <p className="mt-5 text-sm text-gray-500">
            Loading community responders...
          </p>
        ) : (
          <>
            {respondersError && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {respondersError}
              </p>
            )}

            {responderSuccess && (
              <p
                role="status"
                className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
              >
                {responderSuccess}
              </p>
            )}

            {/* Current official assignments */}
            <div className="mt-6 space-y-3">
              {[
                {
                  type: "CHAIRMAN",
                  label: "Chairman",
                },
                {
                  type: "ADMIN_STAFF",
                  label: "Administrative Staff",
                },
                {
                  type: "SECURITY_OFFICER",
                  label: "Security Officer",
                },
              ].map((position) => {
                const assignedResponders = communityResponders.filter(
                  (responder) => responder.responderType === position.type,
                );

                return (
                  <div
                    key={position.type}
                    className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {position.label}
                      </p>

                      {assignedResponders.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {assignedResponders.map((responder) => (
                            <div key={responder.id}>
                              <p className="text-sm text-gray-700">
                                {responder.user.firstName}{" "}
                                {responder.user.lastName}
                              </p>

                              {responder.user.phone && (
                                <p className="text-sm text-gray-500">
                                  {responder.user.phone}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-amber-700">
                          No active officer assigned
                        </p>
                      )}
                    </div>

                    {assignedResponders.map((responder) => (
                      <button
                        key={responder.id}
                        type="button"
                        onClick={() => handleDeactivateResponder(responder.id)}
                        disabled={deactivatingResponderId !== null}
                        className="w-fit rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deactivatingResponderId === responder.id
                          ? "Deactivating..."
                          : "Deactivate assignment"}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Assign a new official responder */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-base font-semibold text-gray-800">
                Assign an Official Officer
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Only active users in your community can be assigned. Security
                Officers must have the Security Personnel role.
              </p>

              <form
                onSubmit={handleAssignResponder}
                className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="responderType"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Official Position
                  </label>

                  <select
                    id="responderType"
                    value={selectedResponderType}
                    onChange={(event) => {
                      setSelectedResponderType(event.target.value);
                      setRespondersError("");
                      setResponderSuccess("");
                    }}
                    required
                    disabled={assigningResponder}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select a position</option>
                    <option value="CHAIRMAN">Chairman</option>
                    <option value="ADMIN_STAFF">Administrative Staff</option>
                    <option value="SECURITY_OFFICER">Security Officer</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="responderUser"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Community User
                  </label>

                  <select
                    id="responderUser"
                    value={selectedResponderUserId}
                    onChange={(event) => {
                      setSelectedResponderUserId(event.target.value);
                      setRespondersError("");
                      setResponderSuccess("");
                    }}
                    required
                    disabled={assigningResponder}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select a user</option>

                    {communityUsers
                      .filter((communityUser) => {
                        // Only active users with completed profiles can be assigned
                        if (
                          communityUser.status !== "ACTIVE" ||
                          communityUser.profileCompleted !== true
                        ) {
                          return false;
                        }

                        const userRole =
                          typeof communityUser.role === "object"
                            ? communityUser.role?.roleType
                            : communityUser.role;

                        // Security officers must have the SECURITY_PERSONNEL role
                        if (
                          selectedResponderType === "SECURITY_OFFICER" &&
                          userRole !== "SECURITY_PERSONNEL"
                        ) {
                          return false;
                        }

                        return true;
                      })
                      .map((communityUser) => (
                        <option key={communityUser.id} value={communityUser.id}>
                          {communityUser.firstName} {communityUser.lastName}
                          {communityUser.houseNumber
                            ? ` — House ${communityUser.houseNumber}`
                            : ""}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={
                      assigningResponder ||
                      !selectedResponderType ||
                      !selectedResponderUserId
                    }
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {assigningResponder ? "Assigning..." : "Assign Officer"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </section>

      {/* Resident Invite Codes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Resident Invite Codes
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create invite codes for residents to register in your community.
          </p>
        </div>

        {/* Create Invite Form */}
        <form onSubmit={handleCreateInvite} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="inviteExpiry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry Date (Optional)
              </label>
              <input
                id="inviteExpiry"
                type="datetime-local"
                value={inviteExpiry}
                onChange={(e) => setInviteExpiry(e.target.value)}
                min={getLocalDateTime()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="inviteMaxUses"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Uses (Optional)
              </label>
              <input
                id="inviteMaxUses"
                type="number"
                min="1"
                step="1"
                value={inviteMaxUses}
                onChange={(e) => setInviteMaxUses(e.target.value)}
                placeholder="Leave blank for unlimited"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {inviteCreateError && (
            <p className="text-sm text-red-600">{inviteCreateError}</p>
          )}

          {inviteMessage && (
            <p className="text-sm text-green-700">{inviteMessage}</p>
          )}

          <button
            type="submit"
            disabled={inviteCreating}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inviteCreating ? "Creating Invite..." : "Create Invite"}
          </button>
        </form>

        {/* Existing Invites */}
        <div className="border-t border-gray-200 pt-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Existing Invites
          </h3>

          {invitesLoading ? (
            <p className="text-sm text-gray-500">Loading invite codes...</p>
          ) : invitesError ? (
            <p className="text-sm text-red-600">{invitesError}</p>
          ) : invites.length === 0 ? (
            <p className="text-sm text-gray-500">
              No invite codes have been created yet.
            </p>
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => {
                const isExpired =
                  invite.expiresAt && new Date(invite.expiresAt) <= new Date();

                const inviteStatus = !invite.isActive
                  ? "Inactive"
                  : isExpired
                    ? "Expired"
                    : "Active";

                return (
                  <div
                    key={invite.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Invite Code
                        </p>
                        <p className="text-lg font-semibold text-gray-800 break-all">
                          {invite.code}
                        </p>
                      </div>

                      <span
                        className={`self-start px-3 py-1 rounded-full text-xs font-medium ${
                          invite.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {invite.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Uses</p>
                        <p className="font-medium text-gray-800">
                          {invite.usedCount} / {invite.maxUses ?? "Unlimited"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Expires</p>
                        <p className="font-medium text-gray-800">
                          {invite.expiresAt
                            ? new Date(invite.expiresAt).toLocaleString()
                            : "No expiry"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
            <p className="text-sm text-gray-500">Plan</p>

            <p className="mt-1 font-semibold text-gray-800">
              {subscriptionPlan?.name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Annual Price</p>

            <p className="mt-1 font-semibold text-gray-800">
              ₦{Number(subscriptionPlan?.annualPrice || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Start Date</p>

            <p className="mt-1 font-semibold text-gray-800">
              {subscriptionStartDate}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Expiry Date</p>

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
            <p className="text-sm text-red-600">{plansError}</p>
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
                    <p>Up to {plan.maxResidents.toLocaleString()} residents</p>

                    <p>Up to {plan.maxSecurityUsers} security personnel</p>
                  </div>

                  <button
                    type="button"
                    className={`w-full mt-5 py-2 rounded-lg font-medium ${
                      selectedPlan?.id === plan.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedPlan && (
            <div className="mt-6 border-t pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Selected plan</p>

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
                    {paymentLoading
                      ? "Initializing Payment..."
                      : "Subscribe Now"}
                  </button>
                </div>
              </div>

              {paymentError && (
                <p className="mt-4 text-sm text-red-600">{paymentError}</p>
              )}

              {paymentMessage && (
                <p className="mt-4 text-sm text-green-600">{paymentMessage}</p>
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
              <p className="text-sm text-gray-500">Loading wallet balance...</p>
            ) : walletError ? (
              <p className="text-sm text-red-600">{walletError}</p>
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
            <p className="text-sm text-gray-500">Loading SMS balance...</p>
          ) : smsError ? (
            <p className="text-sm text-red-600">{smsError}</p>
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
              <p className="text-sm text-gray-500">Loading SMS bundles...</p>
            ) : smsBundlesError ? (
              <p className="text-sm text-red-600">{smsBundlesError}</p>
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

                    <p className="text-sm text-gray-500">SMS credits</p>

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
                  <p className="text-sm text-gray-500">Selected bundle</p>

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
            <p className="mt-4 text-sm text-red-600">{paymentError}</p>
          )}
          {paymentMessage && (
            <p className="mt-4 text-sm text-green-600">{paymentMessage}</p>
          )}
        </div>
      </div>

      {/* Personal Resources */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Wallet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your personal funds
              </p>
            </div>

            <span className="text-3xl">👤</span>
          </div>

          <div className="mt-8">
            {myWalletLoading ? (
              <p className="text-sm text-gray-500">
                Loading wallet balance...
              </p>
            ) : myWalletError ? (
              <p className="text-sm text-red-600">{myWalletError}</p>
            ) : (
              <>
                <p className="text-4xl font-bold text-gray-900">
                  ₦{Number(myWallet?.balance || 0).toLocaleString("en-NG")}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Current personal wallet balance
                </p>
              </>
            )}
          </div>

          <div className="mt-8 border-t pt-5">
            <button
              type="button"
              onClick={() => setShowPersonalWalletFunding(true)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Fund Personal Wallet
            </button>
          </div>
        </div>

        {/* Personal SMS Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* Card heading */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                My Personal SMS
              </h3>

              <p className="text-sm text-gray-500">
                SMS credits available for your personal alerts
              </p>
            </div>

            <span className="text-2xl">📱</span>
          </div>

          {/* Personal SMS balance */}
          {mySmsLoading ? (
            <p className="text-sm text-gray-500">
              Loading personal SMS balance...
            </p>
          ) : mySmsError ? (
            <p className="text-sm text-red-600">{mySmsError}</p>
          ) : (
            <div>
              <p className="text-4xl font-bold text-gray-900">
                {Number(mySmsBalance?.balance ?? 0).toLocaleString("en-NG")}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Personal SMS credits remaining
              </p>
            </div>
          )}

          {/* Available bundles */}
          <div className="mt-6 border-t pt-6">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Buy Personal SMS Credits
            </h4>

            {smsBundlesLoading ? (
              <p className="text-sm text-gray-500">Loading SMS bundles...</p>
            ) : smsBundlesError ? (
              <p className="text-sm text-red-600">{smsBundlesError}</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {smsBundles.map((bundle) => (
                  <button
                    key={bundle.id}
                    type="button"
                    onClick={() => {
                      setSelectedPersonalSmsBundle(bundle);
                      setPersonalSmsPaymentError("");
                      setPersonalSmsPaymentMessage("");
                    }}
                    className={`rounded-lg border p-4 text-left transition ${
                      selectedPersonalSmsBundle?.id === bundle.id
                        ? "border-teal-600 bg-teal-50"
                        : "border-gray-200 hover:border-teal-400"
                    }`}
                  >
                    <p className="text-lg font-semibold text-gray-900">
                      {bundle.smsCount.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-500">SMS credits</p>

                    <p className="mt-2 font-medium text-gray-900">
                      ₦{Number(bundle.price).toLocaleString("en-NG")}
                    </p>

                    {selectedPersonalSmsBundle?.id === bundle.id && (
                      <p className="mt-2 text-sm font-medium text-teal-700">
                        Selected
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected bundle and purchase actions */}
          {selectedPersonalSmsBundle && (
            <div className="mt-6 border-t pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Selected bundle</p>

                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPersonalSmsBundle.smsCount.toLocaleString()} SMS
                  </p>

                  <p className="text-sm text-gray-600">
                    ₦
                    {Number(selectedPersonalSmsBundle.price).toLocaleString(
                      "en-NG",
                    )}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPersonalSmsBundle(null)}
                    disabled={personalSmsPaymentLoading}
                    className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyPersonalSms}
                    disabled={personalSmsPaymentLoading}
                    className="rounded-lg bg-teal-600 px-6 py-2.5 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {personalSmsPaymentLoading
                      ? "Processing..."
                      : "Buy Personal SMS"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personal purchase feedback */}
          {personalSmsPaymentError && (
            <p className="mt-4 text-sm text-red-600">
              {personalSmsPaymentError}
            </p>
          )}

          {personalSmsPaymentMessage && (
            <p className="mt-4 text-sm text-green-600">
              {personalSmsPaymentMessage}
            </p>
          )}
        </div>
      </div>

      {/* Community Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Members */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Community Members</p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {totalMembers}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {activeMembers} active · {inactiveMembers} inactive
          </p>
        </div>

        {/* Residents */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Residents</p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {totalResidents}
          </p>

          <p className="mt-2 text-sm text-gray-500">Registered residents</p>
        </div>

        {/* Security Personnel */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Registered Security Personnel</p>

          <p className="mt-2 text-3xl font-bold text-gray-800">
            {totalSecurityPersonnel}
          </p>

          <p className="mt-2 text-sm text-gray-500">Security personnel</p>
        </div>

        {/* Emergencies */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Emergencies</p>

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
                  <th className="pb-3 font-medium">Type</th>

                  <th className="pb-3 font-medium">Priority</th>

                  <th className="pb-3 font-medium">Status</th>

                  <th className="pb-3 font-medium">Reported By</th>

                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentEmergencies.map((emergency) => (
                  <tr key={emergency.id} className="border-b last:border-b-0">
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
                      {new Date(emergency.createdAt).toLocaleDateString()}
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
            <p className="mt-6 text-gray-500">No recent activity.</p>
          ) : (
            <div className="mt-6 space-y-5">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {/* Activity Indicator */}
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gray-400" />

                  {/* Activity Details */}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800">
                      {getActivityMessage(activity)}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
                      <span>
                        By {activity.user?.firstName} {activity.user?.lastName}
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
          <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access important community features.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => navigate("/emergency")}
              className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-800">View Emergencies</h3>

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
              <h3 className="font-semibold text-gray-800">Notifications</h3>

              <p className="mt-1 text-sm text-gray-500">
                View community notifications.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-800">My Profile</h3>

              <p className="mt-1 text-sm text-gray-500">
                View and update your profile.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/residents")}
              className="rounded-lg border p-4 text-left transition hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-800">Manage Residents</h3>

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

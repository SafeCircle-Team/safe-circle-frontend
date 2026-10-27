import { useState, useEffect } from "react";
import {
  getCommunities,
  createCommunity,
  getCommunity,
  updateCommunity,
  activateCommunity,
  deactivateCommunity,
} from "../../services/communityService";


const Communities = () => {
  console.log("Communities page rendered");
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [updating, setUpdating] = useState(false);

 

  const initialFormData = {
    name: "",
    address: "",
    state: "",
    lga: "",
    ward: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setError("");

        const response = await getCommunities();
        console.log("Communities Response:", response);
        setCommunities(response.data.communities);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);


  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);

      const response = await createCommunity(formData);

      console.log("Community created:", response);

      const updatedCommunities = await getCommunities();
      setCommunities(updatedCommunities.data.communities);

      setFormData(initialFormData);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Create community error:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleViewCommunity = async (communityId) => {
    try {
      setViewLoading(true);
      const response = await getCommunity(communityId);

      console.log("Community details:", response);

      setSelectedCommunity(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("View community error:", error);
    } finally {
      setViewLoading(false);
    }
  };
  const handleEditCommunity = (community) => {
    setEditingCommunity(community);

    setFormData({
      name: community.name || "",
      address: community.address || "",
      state: community.state || "",
      lga: community.lga || "",
      ward: community.ward || "",
    });

    setShowEditModal(true);
  };

  const handleUpdateCommunity = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const response = await updateCommunity(editingCommunity.id, formData);

      console.log("Community updated:", response);

      const updatedCommunities = await getCommunities();

      setCommunities(updatedCommunities.data.communities);

      setFormData(initialFormData);
      setEditingCommunity(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Update community error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleActivateCommunity = async (communityId) => {
    try {
      const response = await activateCommunity(communityId);

      console.log("Community activated:", response);

      const updatedCommunities = await getCommunities();

      setCommunities(updatedCommunities.data.communities);
    } catch (error) {
      console.error("Activate community error:", error);
    }
  };

  const handleDeactivateCommunity = async (communityId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to deactivate this community?",
      );

      if (!confirmed) {
        return;
      }
      const response = await deactivateCommunity(communityId);

      console.log("Community deactivated:", response);

      const updatedCommunities = await getCommunities();
      setCommunities(updatedCommunities.data.communities);
    } catch (error) {
      console.error("Deactivate community error:", error);
    }
  };
 

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Communities</h1>

          <p className="text-gray-500 mt-1">
            Manage communities registered on SafeCircle.
          </p>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Create Community
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Add a new community to SafeCircle.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData(initialFormData);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateCommunity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Community Name
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter community name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>

                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter community address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>

                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          state: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LGA
                    </label>

                    <input
                      type="text"
                      value={formData.lga}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lga: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="LGA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ward
                    </label>

                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ward: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ward"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData(initialFormData);
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {creating ? "creating..." : "Create Community"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Community
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Community
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCommunity(null);
                  setFormData(initialFormData);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateCommunity} className="space-y-4">
              {/* Community Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Community Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>

                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>

                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* LGA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LGA
                </label>

                <input
                  type="text"
                  value={formData.lga}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lga: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Ward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ward
                </label>

                <input
                  type="text"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ward: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCommunity(null);
                    setFormData(initialFormData);
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Community"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedCommunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Community Details
                </h2>
                <p className="text-sm text-gray-500">
                  View community information
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCommunity(null);
                  setShowViewModal(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Details */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Community Name</p>
                    <p className="font-medium text-gray-800">
                      {selectedCommunity.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-gray-800">
                      {selectedCommunity.status}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">
                      {selectedCommunity.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium text-gray-800">
                      {selectedCommunity.state}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">LGA</p>
                    <p className="font-medium text-gray-800">
                      {selectedCommunity.lga}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Ward</p>
                    <p className="font-medium text-gray-800">
                      {selectedCommunity.ward}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Statistics
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Residents</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedCommunity.users?.length || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Emergencies</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedCommunity.emergencies?.length || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(
                        selectedCommunity.createdAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Subscription
                </h3>

                {selectedCommunity.communitySubscriptions?.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Plan</p>
                        <p className="font-medium text-gray-800">
                          {selectedCommunity.communitySubscriptions[0]
                            .subscriptionPlan?.name || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-gray-800">
                          {selectedCommunity.communitySubscriptions[0].status}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-800">
                          {selectedCommunity.communitySubscriptions[0].startDate
                            ? new Date(
                                selectedCommunity.communitySubscriptions[0]
                                  .startDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium text-gray-800">
                          {selectedCommunity.communitySubscriptions[0].endDate
                            ? new Date(
                                selectedCommunity.communitySubscriptions[0]
                                  .endDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Auto Renew</p>
                        <p className="font-medium text-gray-800">
                          {selectedCommunity.communitySubscriptions[0].autoRenew
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No subscription found.
                  </p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 mx-3">
                Recent Activity
              </h3>

              {selectedCommunity.auditLogs?.length > 0 ? (
                <div className="space-y-3 mt-3 mx-2">
                  {selectedCommunity.auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {log.action} {log.entity}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            {log.description}
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            By{" "}
                            {log.user
                              ? `${log.user.firstName} ${log.user.lastName}`
                              : "Unknown user"}
                          </p>
                        </div>

                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No recent activity found.
                </p>
              )}
            </div>

            {/* Recent Emergencies */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 mx-3">
                Recent Emergencies
              </h3>

              {selectedCommunity.emergencies?.length > 0 ? (
                <div className="space-y-3 mt-3 mx-2">
                  {selectedCommunity.emergencies
                    .slice(0, 5)
                    .map((emergency) => (
                      <div
                        key={emergency.id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              {emergency.emergencyType}
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                              Status: {emergency.status}
                            </p>

                            <p className="text-sm text-gray-600">
                              Priority: {emergency.priority}
                            </p>

                            <p className="text-sm text-gray-600">
                              Response: {emergency.response}
                            </p>

                            <p className="text-xs text-gray-500 mt-2">
                              Reported by{" "}
                              {emergency.reportedBy
                                ? `${emergency.reportedBy.firstName} ${emergency.reportedBy.lastName}`
                                : "Unknown user"}
                            </p>
                          </div>

                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(emergency.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No recent emergencies found.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setSelectedCommunity(null);
                  setShowViewModal(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-600">Loading communities...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && communities.length === 0 && (
        <p className="text-gray-600">No communities found.</p>
      )}

      {!loading && !error && communities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Community
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Location
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Residents
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {communities.map((community) => (
                <tr key={community.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">
                      {community.name}
                    </p>

                    <p className="text-sm text-gray-500">{community.address}</p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{community.ward}</p>
                    <p>
                      {community.lga} {community.state}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        community.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {community.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {community.users?.length || 0}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewCommunity(community.id)}
                        disabled={viewLoading}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {viewLoading ? "Loading..." : "View"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditCommunity(community)}
                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        Edit
                      </button>

                      {community.status === "INACTIVE" && (
                        <button
                          type="button"
                          onClick={() => handleActivateCommunity(community.id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Activate
                        </button>
                      )}
                      {community.status === "ACTIVE" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeactivateCommunity(community.id)
                          }
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default Communities;

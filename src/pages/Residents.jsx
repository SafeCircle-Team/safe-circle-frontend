import { getCommunityUsers, 
    updateUserRole,
    updateUserStatus,
} 
from "../services/communityService";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Residents = () => {
  const { user } = useAuth();

  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);
  
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCommunityUsers(user.communityId);
        setResidents(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!user?.communityId) {
      return;
    }

    fetchResidents();
  }, [user?.communityId]);

  const handleRoleUpdate = async () => {
    if (!selectedRole) {
      return;
    }

    try {
      const response = await updateUserRole(
        selectedResident.id,
        selectedRole
      );

      setResidents((currentResidents) => {
        return currentResidents.map((resident) =>
          resident.id === selectedResident.id ? response.data : resident
        );
      });

      setShowRoleModal(false);
      setSelectedResident(null);
      setSelectedRole(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
        const response = await updateUserStatus(
            selectedResident.id,
            status,
            suspensionReason,
        )
        setResidents((currentResidents) => 
          currentResidents.map((resident) => 
            resident.id === selectedResident.id
            ? response.data 
            : resident
        )); 

        setSelectedResident(response.data);

        setShowSuspensionModal(false);
        setSelectedStatus(null);
        setSuspensionReason("");
    } catch (error) {
      setError(error.message)
    }
  }
  

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-sm text-gray-500">Loading residents...</p>
        </div>
      </div>
    );
  }

  if (error && residents.length === 0) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">Unable to load residents</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const totalResidents = residents?.length || 0;

  const activeResidents =
    residents?.filter((resident) => resident.status === "ACTIVE").length || 0;

  const suspendedResidents =
    residents?.filter((resident) => resident.status === "SUSPENDED").length || 0;

  const verifiedResidents =
    residents?.filter(
      (resident) => resident.verificationStatus === "VERIFIED"
    ).length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Residents</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage residents and community access.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Residents
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalResidents}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <span className="text-lg font-bold">R</span>
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Residents
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {activeResidents}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <span className="text-lg font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Verified */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Verified
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {verifiedResidents}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <span className="text-lg font-bold">✓</span>
            </div>
          </div>
        </div>

        {/* Suspended */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Suspended
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {suspendedResidents}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <span className="text-lg font-bold">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Residents Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex flex-col gap-2 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Community Residents
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View resident information and manage access roles.
            </p>
          </div>

          <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            {totalResidents} resident{totalResidents !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Error after an update */}
        {error && residents.length > 0 && (
          <div className="mx-6 mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">House</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {residents.map((resident) => (
                <tr
                  key={resident.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* Resident */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {resident.image ? (
                        <img
                          src={resident.image}
                          alt={`${resident.firstName} ${resident.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                          {resident.firstName?.charAt(0).toUpperCase()}
                          {resident.lastName?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-gray-900">
                          {resident.firstName} {resident.lastName}
                        </p>

                        {resident.aka && (
                          <p className="text-xs text-gray-500">
                            AKA: {resident.aka}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {resident.phone || "N/A"}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {resident.email || "N/A"}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span
                      className={
                        resident.role?.roleType === "SECURITY_PERSONNEL"
                          ? "inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700"
                          : "inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                      }
                    >
                      {resident.role?.roleType || "N/A"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={
                        resident.status === "ACTIVE"
                          ? "inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : resident.status === "SUSPENDED"
                          ? "inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                          : "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                      }
                    >
                      {resident.status}
                    </span>
                  </td>

                  {/* House */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700">
                      {resident.houseNumber || "N/A"}
                    </p>
                    {resident.houseDescription && (
                      <p className="max-w-[180px] truncate text-xs text-gray-500">
                        {resident.houseDescription}
                      </p>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setError("");
                        setSelectedResident(resident);
                      }}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {residents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-medium text-gray-700">
              No residents found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no residents in this community.
            </p>
          </div>
        )}
      </div>

      {/* Resident Details Modal */}
      {selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Resident Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View account and residence information.
                </p>
              </div>

              <button
                onClick={() => setSelectedResident(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Resident Identity */}
            <div className="border-b bg-gray-50 px-6 py-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                {selectedResident.image ? (
                  <img
                    src={selectedResident.image}
                    alt={`${selectedResident.firstName} ${selectedResident.lastName}`}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-2xl font-semibold text-blue-700 shadow">
                    {selectedResident.firstName?.charAt(0)}
                    {selectedResident.lastName?.charAt(0)}
                  </div>
                )}

                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedResident.firstName}{" "}
                    {selectedResident.lastName}
                  </h3>

                  {selectedResident.aka && (
                    <p className="mt-1 text-sm text-gray-500">
                      AKA: {selectedResident.aka}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <span
                      className={
                        selectedResident.status === "ACTIVE"
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      {selectedResident.status}
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {selectedResident.role?.roleType || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
              {/* Personal Information */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Personal Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Name</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.firstName}{" "}
                      {selectedResident.lastName}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">AKA</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.aka || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Phone</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.phone || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Email</span>
                    <span className="break-all text-right font-medium text-gray-800">
                      {selectedResident.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Residence Information */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Residence Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">House Number</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.houseNumber || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Description</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.houseDescription || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Occupancy</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.occupancyType || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Account Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Role</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.role?.roleType || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={
                        selectedResident.status === "ACTIVE"
                          ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      {selectedResident.status}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Verification</span>
                    <span
                      className={
                        selectedResident.verificationStatus === "VERIFIED"
                          ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700"
                      }
                    >
                      {selectedResident.verificationStatus}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Profile Completed</span>
                    <span className="font-medium text-gray-800">
                      {selectedResident.profileCompleted ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Membership Information */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Membership Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Joined</span>
                    <span className="font-medium text-gray-800">
                      {new Date(
                        selectedResident.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Community</span>
                    <span className="text-right font-medium text-gray-800">
                      {selectedResident.community?.name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Role Modal */}
            {showRoleModal && (
              <div className="border-t bg-gray-50 px-6 py-6">
                <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Change Resident Role
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Update the access role for this resident.
                    </p>
                  </div>

                  <div className="mb-5 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Current Role</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {selectedResident.role?.roleType || "N/A"}
                    </p>
                  </div>

                  {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="resident-role"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      New Role
                    </label>

                    <select
                      id="resident-role"
                      value={selectedRole || ""}
                      onChange={(event) =>
                        setSelectedRole(event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select a role</option>
                      <option value="SECURITY_PERSONNEL">
                        Security Personnel
                      </option>
                      <option value="RESIDENT">Resident</option>
                    </select>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setError("");
                        setSelectedRole(null);
                        setShowRoleModal(false);
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleRoleUpdate}
                      disabled={!selectedRole}
                      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            {!showRoleModal && (
              <div className="flex flex-col-reverse gap-3 border-t px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setSelectedResident(null)}
                  className="rounded-lg border border-black bg-green-500 px-4 py-2.5 text-sm font-medium
                   text-black transition hover:bg-green-700 hover:translate-y-0.5"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setError("");
                    setSelectedRole(null);
                    setShowRoleModal(true);
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 hover:translate-y-0.5"
                >
                  Change Role
                </button>
                {selectedResident.status === "ACTIVE" && (
                    <button onClick={() => {
                      setShowSuspensionModal(true);
                    }} className="rounded-lg border border-black bg-red-500 px-4 py-2.5 text-sm font-medium
                     text-white transition hover:translate-y-0.5 hover:bg-red-800">
                    Suspend resident
                    </button>
                )}
                {selectedResident.status === "SUSPENDED" && (
                    <button onClick={() => {
                      handleStatusUpdate("ACTIVE");
                    }}>
                    Reactivate Resident
                    </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {showSuspensionModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
      
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Suspend Resident
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide a reason for suspending this resident.
        </p>
      </div>

      <div className="px-6 py-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Suspension Reason
        </label>

        <textarea
          value={suspensionReason}
          onChange={(e) => setSuspensionReason(e.target.value)}
          rows={3}
          maxLength={100}
          placeholder="Enter reason..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-xs text-gray-400">
          Maximum 100 characters.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t px-6 py-4">
        <button
          onClick={() => {
            setShowSuspensionModal(false);
            setSuspensionReason("");
          }}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button onClick={() => 
          handleStatusUpdate("SUSPENDED")}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Confirm Suspension
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default Residents;



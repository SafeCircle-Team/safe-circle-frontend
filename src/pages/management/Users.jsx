import { useEffect, useState } from "react";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
} from "../../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    roleType: "",
    status: "",
    verificationStatus: "",
    profileCompleted: false,
    suspensionReason: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();

        console.log("Users response:", response);

        setUsers(response.data);
      } catch (error) {
        console.error("Fetch users error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  const handleViewUser = async (userId) => {
    try {
      setViewLoading(true);

      const response = await getUserById(userId);

      console.log("User details:", response);

      setSelectedUser(response.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("View user error:", error);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);

    setEditFormData({
      roleType: user.role?.roleType || "",
      status: user.status || "",
      verificationStatus: user.verificationStatus || "",
      profileCompleted: user.profileCompleted || false,
      suspensionReason: user.suspensionReason || "",
    });

    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      setUpdating(true);

      const response = await updateUser(editingUser.id, editFormData);

      console.log("User updated:", response);

      // Refresh the users list
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers.data);

      // Close the modal
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Update user error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeactivateUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`,
    );

    if (!confirmed) return;

    try {
      const response = await deactivateUser(user.id);

      console.log("User deactivated:", response);

      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers.data);
    } catch (error) {
      console.error("Deactivate user error:", error);
    }
  };

  const handleActivateUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to activate ${user.firstName} ${user.lastName}?`,
    );

    if (!confirmed) return;

    try {
      const response = await updateUser(user.id, {
        status: "ACTIVE",
      });

      console.log("User activated:", response);

      // Refresh the users list
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers.data);
    } catch (error) {
      console.error("Activate user error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                User
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Community
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.role?.roleType}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.community?.name || "No community"}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.status}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.verificationStatus}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleViewUser(user.id)}
                      disabled={viewLoading}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {viewLoading ? "Loading..." : "View"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditUser(user)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    {user.status === "ACTIVE" && (
                      <button
                        type="button"
                        onClick={() => handleDeactivateUser(user)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Deactivate
                      </button>
                    )}

                    {user.status === "INACTIVE" && (
                      <button
                        type="button"
                        onClick={() => handleActivateUser(user)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Activate
                      </button>
                    )}

                    {user.status === "SUSPENDED" && (
                      <span className="text-amber-600 text-sm font-medium">
                        Suspended
                      </span>
                    )}
                  </div>
                </td>
                {showEditModal && editingUser && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                      <div className="flex justify-between items-center px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold">Edit User</h2>

                        <button
                          type="button"
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingUser(null);
                          }}
                          className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                          ×
                        </button>
                      </div>

                      <div className="p-6">
                        <p className="mb-6 text-gray-700">
                          {editingUser.firstName} {editingUser.lastName}
                        </p>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Role
                            </label>

                            <select
                              className="w-full border rounded-md px-3 py-2"
                              value={editFormData.roleType}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  roleType: e.target.value,
                                })
                              }
                            >
                              <option value="RESIDENT">Resident</option>

                              <option value="SECURITY_PERSONNEL">
                                Security Personnel
                              </option>

                              <option value="COMMUNITY_ADMIN">
                                Community Admin
                              </option>

                              <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>

                            <select
                              className="w-full border rounded-md px-3 py-2"
                              value={editFormData.status}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="INACTIVE">Inactive</option>
                              <option value="SUSPENDED">Suspended</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Verification Status
                            </label>

                            <select
                              className="w-full border rounded-md px-3 py-2"
                              value={editFormData.verificationStatus}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  verificationStatus: e.target.value,
                                })
                              }
                            >
                              <option value="PENDING">Pending</option>
                              <option value="VERIFIED">Verified</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </div>
                          {editFormData.status === "SUSPENDED" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Suspension Reason
                              </label>

                              <textarea
                                className="w-full border rounded-md px-3 py-2"
                                rows="3"
                                value={editFormData.suspensionReason}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    suspensionReason: e.target.value,
                                  })
                                }
                                placeholder="Enter reason for suspension"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Profile Completed
                            </label>

                            <select
                              className="w-full border rounded-md px-3 py-2"
                              value={editFormData.profileCompleted}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  profileCompleted: e.target.value,
                                })
                              }
                            >
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingUser(null);
                          }}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleUpdateUser}
                          disabled={updating}
                          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                        >
                          {updating ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">User Details</h2>

              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Basic Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="font-medium">
                      {selectedUser.firstName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="font-medium">
                      {selectedUser.lastName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedUser.phone || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedUser.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Account Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium">
                      {selectedUser.role?.roleType || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {selectedUser.status || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Verification</p>
                    <p className="font-medium">
                      {selectedUser.verificationStatus || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Profile Completed</p>
                    <p className="font-medium">
                      {selectedUser.profileCompleted ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Community
                </h3>

                <p className="font-medium">
                  {selectedUser.community?.name || "No community"}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

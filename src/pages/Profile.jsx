import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../services/userService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    aka: "",
    email: "",
    phone: "",
    houseNumber: "",
    houseDescription: "",
    occupancyType: "",
  });

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const { user } = useAuth();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await getMyProfile();

        setProfile(response.data);

        setFormData({
          firstName: response.data.firstName?.trim() || "",
          lastName: response.data.lastName?.trim() || "",
          aka: response.data.aka || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          houseNumber: response.data.houseNumber || "",
          houseDescription: response.data.houseDescription || "",
          occupancyType: response.data.occupancyType || "",
        });
      } catch (error) {
        setProfileError(error.message);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName?.trim() || "",
      lastName: profile?.lastName?.trim() || "",
      aka: profile?.aka || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      houseNumber: profile?.houseNumber || "",
      houseDescription: profile?.houseDescription || "",
      occupancyType: profile?.occupancyType || "",
    });

    setUpdateError("");
    setUpdateMessage("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError("");
      setUpdateMessage("");

      const response = await updateMyProfile(formData);

      setProfile(response.data);

      setUpdateMessage(response.message);
      setIsEditing(false);
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

      <p className="mt-2 text-gray-600">
        Manage your personal account information.
      </p>
      {updateMessage && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {updateMessage}
        </div>
      )}

      {updateError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {updateError}
        </div>
      )}

      {profileLoading ? (
        <p className="mt-6 text-sm text-gray-500">Loading profile...</p>
      ) : profileError ? (
        <p className="mt-6 text-sm text-red-600">{profileError}</p>
      ) : (
        <>
          {/* Personal Information */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h2>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setUpdateError(""); 
                    setUpdateMessage("");
                    setIsEditing(true)
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="mt-6 space-y-5">
                {/* First Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* AKA */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Also Known As
                  </label>

                  <input
                    type="text"
                    name="aka"
                    value={formData.aka}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.firstName?.trim() || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.lastName?.trim() || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Also Known As</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.aka || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Occupancy</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.occupancyType || "Not provided"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={updateLoading}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Residence Information */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Residence Information
            </h2>

            {isEditing ? (
              <div className="mt-6 space-y-5">
                {/* House Number */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    House Number
                  </label>

                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* House Description */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    House Description
                  </label>

                  <textarea
                    name="houseDescription"
                    value={formData.houseDescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Occupancy Type */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Occupancy Type
                  </label>

                  <select
                    name="occupancyType"
                    value={formData.occupancyType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select occupancy type</option>
                    <option value="OWNER">Owner</option>
                    <option value="TENANT">Tenant</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">House Number</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.houseNumber || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Occupancy</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.occupancyType || "Not provided"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">House Description</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {profile?.houseDescription || "Not provided"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Account Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.role?.roleType || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.status || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Verification Status</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.verificationStatus || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Profile Completed</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.profileCompleted ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Community Information */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Community Information
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Community</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.community?.name || "Not assigned"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.community?.state || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">LGA</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.community?.lga || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Ward</p>
                <p className="mt-1 font-medium text-gray-800">
                  {profile?.community?.ward || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

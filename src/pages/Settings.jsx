import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  changeMyPassword,
  setMyEmergencyPin,
  changeMyEmergencyPin,
  getMyProfile,
} from "../services/userService";
import {
  updateSystemSettings,
  getSystemSettings,
} from "../services/systemSettingsService";

const Settings = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const [pinMessageType, setPinMessageType] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [systemSettings, setSystemSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsMessageType, setSettingsMessageType] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setHasPin(response.data.hasEmergencyPin);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchSystemSettings = async () => {
      try {
        setSettingsLoading(true);

        const response = await getSystemSettings();

        console.log("System Settings:", response.data);

        setSystemSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch system settings:", error);

        setSettingsMessage("Failed to load system settings.");
        setSettingsMessageType("error");
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSystemSettings();
  }, [isSuperAdmin]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordMessageType("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      setPasswordMessageType("error");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await changeMyPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordMessage(response.message || "Password changed successfully.");
      setPasswordMessageType("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage(error.message || "Failed to change password.");
      setPasswordMessageType("error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePinChange = async (e) => {
    e.preventDefault();
    setPinMessage("");
    setPinMessageType("");

    if (newPin !== confirmPin) {
      setPinMessage("PINs do not match.");
      setPinMessageType("error");
      return;
    }

    try {
      setPinLoading(true);

      const pinData = hasPin
        ? { currentPin, newPin, confirmPin }
        : { newPin, confirmPin };

      const response = hasPin
        ? await changeMyEmergencyPin(pinData)
        : await setMyEmergencyPin(pinData);

      setPinMessage(response.message || "Emergency PIN saved successfully.");
      setPinMessageType("success");

      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setHasPin(true);
    } catch (error) {
      setPinMessage(error.message || "Failed to save Emergency PIN.");
      setPinMessageType("error");
    } finally {
      setPinLoading(false);
    }
  };

  const handleSystemSettingsSave = async (e) => {
    e.preventDefault();

    try {
      setSettingsSaving(true);
      setSettingsMessage("");

      const {
        platformName,
        supportEmail,
        supportPhone,
        supportAddress,
        maintenanceMode,
        allowRegistration,
        requireResidentVerification,
        defaultUserStatus,
        defaultCommunityStatus,
        jwtExpiry,
        maxLoginAttempts,
        lockoutDuration,
        defaultCountry,
        defaultCurrency,
        defaultTimezone,
        paymentTimeoutMinutes,
        autoVerifyPayments,
        smsEnabled,
        emailEnabled,
        pushNotificationsEnabled,
        defaultInviteExpiryDays,
        defaultInviteMaxUses,
      } = systemSettings;

      const settingsData = {
        platformName,
        maintenanceMode,
        allowRegistration,
        requireResidentVerification,
        defaultUserStatus,
        defaultCommunityStatus,
        jwtExpiry,
        maxLoginAttempts,
        lockoutDuration,
        defaultCountry,
        defaultCurrency,
        defaultTimezone,
        paymentTimeoutMinutes,
        autoVerifyPayments,
        smsEnabled,
        emailEnabled,
        pushNotificationsEnabled,
        defaultInviteExpiryDays,
        defaultInviteMaxUses,
        ...(supportEmail ? { supportEmail } : {}),
        ...(supportPhone ? { supportPhone } : {}),
        ...(supportAddress ? { supportAddress } : {}),
      };

      const response = await updateSystemSettings(settingsData);

      setSystemSettings(response.data);
      setSettingsMessage("System settings updated successfully.");
      setSettingsMessageType("success");
    } catch (error) {
      console.error("Failed to update system settings:", error);

      setSettingsMessage(
        error.response?.data?.message || "Failed to update system settings.",
      );
      setSettingsMessageType("error");
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <p className="mt-2 text-gray-600">
        Manage your account security and preferences.
      </p>

      {/* Change Password */}
      <section className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>

        <p className="mt-1 text-sm text-gray-500">
          Update your password to keep your account secure.
        </p>

        {/* Password form */}

        <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-16"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-16"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {passwordMessage && (
            <p
              className={`text-sm ${
                passwordMessageType === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {passwordLoading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </section>

      {/* Emergency PIN */}
      <section className="mt-6 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">Emergency PIN</h2>

        <p className="mt-1 text-sm text-gray-500">
          Set or change the PIN used to protect your emergency actions.
        </p>

        {/* PIN form */}

        <form onSubmit={handlePinChange} className="mt-6 space-y-4">
          {hasPin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current PIN
              </label>
              <div className="relative mt-1">
                <input
                  type={showCurrentPin ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-16"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                >
                  {showCurrentPin ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New PIN
            </label>
            <div className="relative mt-1">
              <input
                type={showNewPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]{4}"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-16"
              />

              <button
                type="button"
                onClick={() => setShowNewPin(!showNewPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showNewPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New PIN
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPin ? "text" : "password"}
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]{4}"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-16"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {showConfirmPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {pinMessage && (
            <p
              className={`text-sm ${
                pinMessageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {pinMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={pinLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {pinLoading
              ? "Saving..."
              : hasPin
                ? "Change PIN"
                : "Set Emergency PIN"}
          </button>
        </form>
      </section>

      {/* Super Admin System Settings */}
      {isSuperAdmin && (
        <section className="mt-6 rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            System Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the general configuration of the SafeCircle platform.
          </p>

          {settingsLoading ? (
            <p className="mt-4 text-sm text-gray-500">
              Loading system settings...
            </p>
          ) : systemSettings ? (
            <div className="mt-6 space-y-4">
              {/* Platform Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={systemSettings.platformName || ""}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      platformName: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              {/* Support Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Support Email
                </label>
                <input
                  type="email"
                  value={systemSettings.supportEmail || ""}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      supportEmail: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              {/* Support Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Support Phone
                </label>
                <input
                  type="text"
                  value={systemSettings.supportPhone || ""}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      supportPhone: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              {/* Support Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Support Address
                </label>
                <textarea
                  value={systemSettings.supportAddress || ""}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      supportAddress: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                />
              </div>
              {/* Registration and Account Defaults */}
              <div className="border-t pt-5">
                <h3 className="text-base font-semibold text-gray-800">
                  Registration and Account Defaults
                </h3>

                {/* Allow Registration */}
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.allowRegistration}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          allowRegistration: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Allow new user registrations
                    </span>
                  </label>
                </div>

                {/* Require Resident Verification */}
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.requireResidentVerification}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          requireResidentVerification: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Require resident verification
                    </span>
                  </label>
                </div>

                {/* Default User Status */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Default User Status
                  </label>

                  <select
                    value={systemSettings.defaultUserStatus}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        defaultUserStatus: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>
              {/* Community and Regional Defaults */}
              <div className="border-t pt-5">
                <h3 className="text-base font-semibold text-gray-800">
                  Community and Regional Defaults
                </h3>

                {/* Default Community Status */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Community Status
                  </label>

                  <select
                    value={systemSettings.defaultCommunityStatus}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        defaultCommunityStatus: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>

                {/* Default Country */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Country
                  </label>
                  <input
                    type="text"
                    value={systemSettings.defaultCountry || ""}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        defaultCountry: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Default Currency */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Currency
                  </label>
                  <input
                    type="text"
                    value={systemSettings.defaultCurrency || ""}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        defaultCurrency: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Default Timezone */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Timezone
                  </label>
                  <input
                    type="text"
                    value={systemSettings.defaultTimezone || ""}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        defaultTimezone: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              {/* Security Settings */}
              <div className="border-t pt-5">
                <h3 className="text-base font-semibold text-gray-800">
                  Security Settings
                </h3>

                {/* JWT Expiry */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    JWT Expiry
                  </label>
                  <input
                    type="text"
                    value={systemSettings.jwtExpiry || ""}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        jwtExpiry: e.target.value,
                      })
                    }
                    placeholder="e.g. 7d"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Maximum Login Attempts */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Login Attempts
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        maxLoginAttempts: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Lockout Duration */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Lockout Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={systemSettings.lockoutDuration}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        lockoutDuration: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              {/* Notifications and Payment Settings */}
              <div className="border-t pt-5">
                <h3 className="text-base font-semibold text-gray-800">
                  Notifications and Payment Settings
                </h3>

                {/* SMS Enabled */}
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.smsEnabled}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          smsEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Enable SMS notifications
                    </span>
                  </label>
                </div>

                {/* Email Enabled */}
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.emailEnabled}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          emailEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Enable email notifications
                    </span>
                  </label>
                </div>

                {/* Push Notifications Enabled */}
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.pushNotificationsEnabled}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          pushNotificationsEnabled: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Enable push notifications
                    </span>
                  </label>
                </div>

                {/* Automatic Payment Verification */}
                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.autoVerifyPayments}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          autoVerifyPayments: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-700">
                      Automatically verify payments
                    </span>
                  </label>
                </div>
              </div>
              {/* Platform Maintenance */}
              <div className="border-t pt-5">
                <h3 className="text-base font-semibold text-gray-800">
                  Platform Maintenance
                </h3>

                <div className="mt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          maintenanceMode: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />

                    <span className="text-sm text-gray-700">
                      Enable maintenance mode
                    </span>
                  </label>

                  <p className="mt-1 text-sm text-gray-500">
                    Temporarily place the platform in maintenance mode.
                  </p>
                </div>
              </div>
              {/* Invitation and Payment Settings */}
              <div className="border-t pt-5">
                <h3 className="text-base font-semibold text-gray-800">
                  Invitation and Payment Settings
                </h3>

                {/* Payment Timeout */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={systemSettings.paymentTimeoutMinutes}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        paymentTimeoutMinutes: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Invite Expiry */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Invite Expiry (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={systemSettings.defaultInviteExpiryDays}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        defaultInviteExpiryDays: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {/* Invite Maximum Uses */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Default Invite Maximum Uses
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={systemSettings.defaultInviteMaxUses}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        defaultInviteMaxUses: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              {/* Save System Settings */}
              <div className="border-t pt-5">
                {settingsMessage && (
                  <p
                    className={`mb-4 text-sm ${
                      settingsMessageType === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {settingsMessage}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSystemSettingsSave}
                  disabled={settingsSaving || settingsLoading}
                  className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {settingsSaving ? "Saving..." : "Save System Settings"}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-red-600">
              {settingsMessage || "System settings are unavailable."}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default Settings;

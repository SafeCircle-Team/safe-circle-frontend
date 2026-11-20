import { useState, useEffect } from "react";
import {
  changeMyPassword,
  setMyEmergencyPin,
  changeMyEmergencyPin,
  getMyProfile,
} from "../services/userService";

const Settings = () => {
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
    </div>
  );
};

export default Settings;

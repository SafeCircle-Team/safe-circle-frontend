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

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [hasPin, setHasPin] = useState(false);

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

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
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

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePinChange = async (e) => {
    e.preventDefault();
    setPinMessage("");

    if (newPin !== confirmPin) {
      setPinMessage("PINs do not match.");
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

      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setHasPin(true);
    } catch (error) {
      setPinMessage(error.message || "Failed to save Emergency PIN.");
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
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {passwordMessage && (
            <p className="text-sm text-gray-700">{passwordMessage}</p>
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
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                pattern="[0-9]{4}"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              pattern="[0-9]{4}"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              pattern="[0-9]{4}"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          {pinMessage && <p className="text-sm text-gray-700">{pinMessage}</p>}

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

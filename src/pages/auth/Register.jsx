import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    
    try {
    const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        inviteCode: formData.inviteCode,
      };

      await registerUser(registrationData);

      setSuccess(
        "Registration successful. You can now log in."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold">
          Join SafeCircle
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Create your resident account
        </p>

        {error && (
          <div className="mb-5 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-md bg-green-100 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08012345678"
              required
              pattern="[0-9]{11}"
              maxLength={11}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Enter your 11-digit Nigerian phone number.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Password must contain at least 6 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="inviteCode"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Community Invite Code
            </label>

            <input
              id="inviteCode"
              name="inviteCode"
              type="text"
              value={formData.inviteCode}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 uppercase outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Enter the invite code provided by your community.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
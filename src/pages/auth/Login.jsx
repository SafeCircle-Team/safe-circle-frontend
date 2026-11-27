
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
    setLoading(true);

    try {
      await login({
        phone: formData.phone.trim(),
        password: formData.password.trim(),
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">

      <div className="w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-xl grid md:grid-cols-2">

        {/* Left: Image Section */}
        <div className="flex items-center justify-center bg-blue-50 p-5 md:p-8 lg:p-10">
          <img
            src="https://yzhwcrhklmjggnofsxet.supabase.co/storage/v1/object/public/safecircle-assets/safecircle-login.png"
            alt="SafeCircle community safety"
            className="w-full aspect-video rounded-xl object-contain"
          />
        </div>

        {/* Right: Login Form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 md:px-8 lg:px-14">

          <div className="w-full max-w-lg">

            <h1 className="text-3xl font-bold text-center text-blue-900 mb-3">
              SafeCircle
            </h1>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Welcome Back!
            </h2>

            <p className="text-center text-gray-600 mb-8">
              Sign in to your account to continue.
            </p>

            {error && (
              <div className="mb-5 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-900 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-blue-700 hover:text-blue-900"
              >
                Register
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

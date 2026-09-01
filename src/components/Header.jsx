import { useAuth } from "../context/AuthContext";
import { useNavigate} from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/login");
    };

  return (
    <header className="bg-white border-b">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          SafeCircle
        </h1>

        <div className="text-right">
          <p className="font-medium text-gray-800">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="text-sm text-gray-500">
            {user?.role}
          </p>

          <button
            onClick={handleLogout}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Logout
          </button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
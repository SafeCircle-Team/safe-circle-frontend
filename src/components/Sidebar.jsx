import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const isCommunityAdmin = user?.role === "COMMUNITY_ADMIN";
  const isResident = user?.role === "RESIDENT";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <aside className="w-64 min-h-[calc(100vh-65px)] bg-white border-r">
      <nav className="p-6">
        <ul className="space-y-3">
          <li>
            <Link
              to="/dashboard"
              className="block text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </li>
          {isCommunityAdmin && (
            <li>
              <Link
                to="/residents"
                className="block text-gray-700 hover:text-blue-600"
              >
                Residents
              </Link>
            </li>
          )}

          <li>
            <Link
              to="/emergency"
              className="block text-gray-700 hover:text-blue-600"
            >
              Emergency
            </Link>
          </li>

          <li>
            <Link
              to="/contacts"
              className="block text-gray-700 hover:text-blue-600"
            >
              Emergency Contacts
            </Link>
          </li>

          <li>
            <Link
              to="/community"
              className="block text-gray-700 hover:text-blue-600"
            >
              My Community
            </Link>
          </li>

          <li>
            <Link
              to="/notifications"
              className="block text-gray-700 hover:text-blue-600"
            >
              Notifications
            </Link>
          </li>

          <li>
            <Link
              to="/profile"
              className="block text-gray-700 hover:text-blue-600"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block text-gray-700 hover:text-blue-600"
            >
              Settings
            </Link>
          </li>

          {isSuperAdmin && (
            <li>
              <Link
                to="/management/users"
                className="block text-gray-700 hover:text-blue-600"
              >
                Users
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

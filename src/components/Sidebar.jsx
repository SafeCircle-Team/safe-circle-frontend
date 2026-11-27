
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, unreadCount } = useAuth();

  const isCommunityAdmin = user?.role === "COMMUNITY_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="fixed inset-x-0 bottom-0 top-[65px] z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`${
          isOpen
            ? "fixed inset-y-0 top-[65px] z-30 block w-72 max-w-[85vw] shadow-xl md:static md:z-auto md:w-64 md:shadow-none"
            : "hidden md:block md:w-64"
        } shrink-0 overflow-y-auto border-r border-gray-200 bg-white md:min-h-[calc(100vh-65px)]`}
      >
        <nav className="p-5 sm:p-6">
          <ul className="space-y-3">

            <li>
              <Link onClick={onClose} to="/dashboard" className="block text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            </li>

            {isCommunityAdmin && (
              <li>
                <Link onClick={onClose} to="/residents" className="block text-gray-700 hover:text-blue-600">
                  Residents
                </Link>
              </li>
            )}

            <li>
              <Link onClick={onClose} to="/emergency" className="block text-gray-700 hover:text-blue-600">
                Emergency
              </Link>
            </li>

            <li>
              <Link onClick={onClose} to="/incidents" className="block text-gray-700 hover:text-blue-600">
                Incidents
              </Link>
            </li>

            <li>
              <Link onClick={onClose} to="/contacts" className="block text-gray-700 hover:text-blue-600">
                Emergency Contacts
              </Link>
            </li>

            {isCommunityAdmin && (
              <li>
                <Link onClick={onClose} to="/community" className="block text-gray-700 hover:text-blue-600">
                  My Community
                </Link>
              </li>
            )}

            <li>
              <Link
                onClick={onClose}
                to="/notifications"
                className="flex items-center justify-between text-gray-700 hover:text-blue-600"
              >
                <span>Notifications</span>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </li>

            <li>
              <Link onClick={onClose} to="/profile" className="block text-gray-700 hover:text-blue-600">
                Profile
              </Link>
            </li>

            <li>
              <Link onClick={onClose} to="/settings" className="block text-gray-700 hover:text-blue-600">
                Settings
              </Link>
            </li>

            {isSuperAdmin && (
              <li>
                <Link onClick={onClose} to="/management/users" className="block text-gray-700 hover:text-blue-600">
                  Users
                </Link>
              </li>
            )}

          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

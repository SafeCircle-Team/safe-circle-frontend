
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex min-w-0 items-center justify-between gap-2 px-2 py-3 sm:gap-3 sm:px-6">

        {/* Branding and Mobile Menu */}
        <div className="flex min-w-0 shrink items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9 12 2 2 4-4"
              />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold text-gray-800 sm:text-xl">
              SafeCircle
            </h1>

            <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold tracking-wide text-green-700">
              SAFETY
            </span>
          </div>
        </div>

        {/* User Information */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="text-right">
            <p className="max-w-[90px] truncate text-xs font-semibold text-gray-800 sm:max-w-none sm:text-sm">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="max-w-[90px] truncate text-xs text-gray-500 sm:max-w-none">
              {user?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50 sm:px-3 sm:text-sm"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;

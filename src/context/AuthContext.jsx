import { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { getUnreadNotificationCount } from "../services/notificationService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      return null;
    }

    return JSON.parse(storedUser);
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    const fetchUnreadCount = async () => {
      if (!user) return;

      try {
        const response = await getUnreadNotificationCount();

        if (response.success && isActive) {
          setUnreadCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error("Fetch unread notification count error:", error);
      }
    };

    fetchUnreadCount();

    return () => {
      isActive = false;
    };
  }, [user]);

  const refreshUnreadCount = async () => {
    if (!user) return;

    try {
      const response = await getUnreadNotificationCount();

      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Refresh unread notification count error:", error);
    }
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const { token, ...userData } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUnreadCount(0);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    unreadCount,
    refreshUnreadCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

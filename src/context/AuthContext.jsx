import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/authService";

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
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
       
};

export const useAuth = () => {
  return useContext(AuthContext);
};

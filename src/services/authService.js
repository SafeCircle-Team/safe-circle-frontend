import api from "./api";

export const registerUser = async (userData) => {
    return await api("/auth/register", {
        method: "POST",
        body: userData,
    });
};

export const loginUser = async (credentials) => {
    return await api("/auth/login", {
        method: "POST",
        body: credentials,
    });
};
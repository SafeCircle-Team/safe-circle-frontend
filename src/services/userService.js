import api from "./api";

export const getMyProfile = async () => {
  return await api("/users/profile", {
    method: "GET",
  });
};

export const updateMyProfile = async (profileData) => {
  return await api("/users/me", {
    method: "PUT",
    body: profileData,
  });
};

export const getAllUsers = async () => {
  return await api("/users", {
    method: "GET",
  });
};

export const getUserById = async (userId) => {
  return await api(`/users/${userId}`, {
    method: "GET",
  });
};

export const updateUser = async (userId, userData) => {
  return await api(`/users/${userId}`, {
    method: "PATCH",
    body: userData,
  });
};
export const deactivateUser = async (userId) => {
  return await api(`/users/${userId}`, {
    method: "DELETE",
  });
};

export const changeMyPassword = async (passwordData) => {
  return await api("/users/me/password", {
    method: "PUT",
    body: passwordData,
  });
};

export const setMyEmergencyPin = async (pinData) => {
  return await api("/users/me/pin", {
    method: "PUT",
    body: pinData,
  });
};

export const changeMyEmergencyPin = async (pinData) => {
  return await api("/users/me/pin/change", {
    method: "PUT",
    body: pinData,
  });
};

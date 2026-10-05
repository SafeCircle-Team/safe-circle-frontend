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
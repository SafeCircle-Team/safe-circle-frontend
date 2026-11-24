
import api from "./api";

// Get system settings
export const getSystemSettings = async () => {
  return await api("/systemSettings", {
    method: "GET",
  });
};

// Update system settings
export const updateSystemSettings = async (settingsData) => {
  return await api("/systemSettings", {
    method: "PATCH",
    body: settingsData,
  });
};

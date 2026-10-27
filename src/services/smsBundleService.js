import api from "./api";

export const getSmsBundles = async () => {
  return await api("/sms-bundles", {
    method: "GET",
  });
};

export const getMySmsBalance = async () => {
  return await api("/sms/balance", {
    method: "GET",
  });
};

export const getCommunitySmsBalance = async () => {
  return await api("/sms/community-balance", {
    method: "GET",
  });
};

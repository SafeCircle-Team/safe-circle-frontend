import api from "./api";

export const getCommunityWalletBalance = async () => {
  return await api("/wallets/community-balance", {
    method: "GET",
  });
};
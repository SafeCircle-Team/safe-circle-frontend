import api from "./api";

// Get the community wallet balance
export const getCommunityWalletBalance = async () => {
  return await api("/wallets/community-balance", {
    method: "GET",
  });
};

// Get the logged-in user's personal wallet balance
export const getMyWalletBalance = async () => {
  return await api("/wallets/balance", {
    method: "GET",
  })
}


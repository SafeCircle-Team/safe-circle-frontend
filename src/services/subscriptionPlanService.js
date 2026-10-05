import api from "./api";

export const getSubscriptionPlans = async () => {
  return await api("/subscription-plans", {
    method: "GET",
  });
};

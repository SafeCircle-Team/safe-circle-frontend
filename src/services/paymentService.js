
import api from "./api";

export const createPayment = async (paymentData) => {
  return await api("/payments", {
    method: "POST",
    body: paymentData,
  });
};

export const verifyPayment = async (reference) => {
  return await api(`/payments/${reference}`, {
    method: "PATCH",
  });
};

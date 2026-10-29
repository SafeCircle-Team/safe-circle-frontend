
import api from "./api";

// Fetch official responders for the current community
export const getCommunityResponders = async () => {
  return await api("/communityResponders/responders", {
    method: "GET",
  });
};

// Assign a user to an official responder position
export const createCommunityResponder = async (responderData) => {
  return await api("/communityResponders/responders", {
    method: "POST",
    body: responderData,
  });
};

// Change an existing responder's official position
export const updateCommunityResponder = async (id, responderData) => {
  return await api(`/communityResponders/responders/${id}`, {
    method: "PATCH",
    body: responderData,
  });
};

// Deactivate an existing responder assignment
export const deactivateCommunityResponder = async (id) => {
  return await api(`/communityResponders/responders/${id}/deactivate`, {
    method: "PATCH",
  });
};

// Check whether all required responder positions are assigned
export const checkCommunityResponderReadiness = async () => {
  return await api("/communityResponders/responders/readiness", {
    method: "GET",
  });
};



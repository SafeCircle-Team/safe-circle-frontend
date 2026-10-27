import api from "./api";

export const getCommunity = async (communityId) => {
  return await api(`/communities/${communityId}`, {
    method: "GET",
  });
};

export const getCommunityUsers = async (communityId) => {
  return await api(`/communities/${communityId}/users`, {
    method: "GET",
  });
};

export const updateUserRole = async (userId, role) => {
  return await api(`/users/${userId}`, {
    method: "PATCH",
    body: {
      roleType: role,
    },
  });
};
export const updateUserStatus = async (userId, status, suspensionReason) => {
  return await api(`/users/${userId}`, {
    method: "PATCH",
    body: {
      status: status,
      suspensionReason: suspensionReason,
    },
  });
};

export const getCommunities = async () => {
  return await api("/communities", {
    method: "GET",
  });
};

export const createCommunity = async (formData) => {
  return await api("/communities", {
    method: "POST",
    body: formData,
  });
};

export const updateCommunity = async (communityId, formData) => {
  return await api(`/communities/${communityId}`, {
    method:"PUT",
    body: formData,
  });
};

export const activateCommunity = async (communityId) => {
  return await api(`/communities/${communityId}`, {
    method: "PUT",
    body: {
      status: "ACTIVE",
    },
  });
};

export const deactivateCommunity = async (communityId) => {
  return await api(`/communities/${communityId}`, {
    method: "DELETE",
  });
};

export const getCommunityResponders = async () => {
  return await api("/communityResponders/responders", {
    method: "GET",
  });
};

export const getEmergencyRecipientPreferences = async () => {
  return await api("/emergency-recipient-preferences", {
    method: "GET",
  });
};

export const addEmergencyRecipientPreference = async (recipientUserId) => {
  return await api("/emergency-recipient-preferences", {
    method: "POST",
    body: { 
      recipientUserId 
    },
  });
};

export const removeEmergencyRecipientPreference = async (recipientUserId) => {
  return await api(`/emergency-recipient-preferences/${recipientUserId}`, {
    method: "DELETE",
  });
};

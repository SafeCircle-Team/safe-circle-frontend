
import api from "./api";

// Create a community invite
export const createCommunityInvite = async (inviteData) => {
  return await api("/communityInvites", {
    method: "POST",
    body: inviteData,
  });
};

// Get community invites
export const getCommunityInvites = async () => {
  return await api("/communityInvites", {
    method: "GET",
  });
};

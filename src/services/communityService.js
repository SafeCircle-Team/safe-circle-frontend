import api from "./api";

export const getCommunity = async (communityId) => {
    return await api(`/communities/${communityId}`, {
        method: "GET",
    })
}

export const getCommunityUsers = async (communityId) => {
  return await api(`/communities/${communityId}/users`, {
    method: "GET",
  })
}

export const updateUserRole = async (userId, role) => {
  return await api(`/users/${userId}`, {
    method: "PATCH",
    body: {
      roleType: role
    }
  })
}
export const updateUserStatus = async (userId, status, suspensionReason) => {
  return await api(`/users/${userId}`, {
    method: "PATCH",
    body: {
      status: status,
      suspensionReason: suspensionReason
    }
  })
}

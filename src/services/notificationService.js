import api from "./api";

// Get notifications belonging to the logged-in user
export const getMyNotifications = async () => {
  return api("/notifications", {
    method: "GET",
  });
};

// Mark an individual notification as read
export const markNotificationAsRead = async (notificationId) => {
  return api(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  return api("/notifications/read-all", {
    method: "PATCH",
  });
};

// Get unread notification count
export const getUnreadNotificationCount = async () => {
  return api("/notifications/unread-count", {
    method: "GET",
  });
};

// Create and publish a notification
export const createNotification = async (notificationData) => {
  return api("/notifications", {
    method: "POST",
    body: notificationData,
  });
};

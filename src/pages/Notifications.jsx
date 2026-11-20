import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
} from "../services/notificationService";
import { getCommunities } from "../services/communityService";

const Notifications = () => {
  const { user, refreshUnreadCount } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingNotificationId, setMarkingNotificationId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [actionError, setActionError] = useState("");

  const [communities, setCommunities] = useState([]);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "ANNOUNCEMENT",
    priority: "NORMAL",
    communityId: "",
    recipientRole: "",
  });

  useEffect(() => {
    const fetchCommunities = async () => {
      if (user?.role !== "SUPER_ADMIN") return;

      try {
        const response = await getCommunities();

        if (response.success) {
          setCommunities(response.data.communities);
        }
      } catch (error) {
        console.error("Fetch communities error:", error);
        setPublishError("Failed to load communities.");
      }
    };

    fetchCommunities();
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getMyNotifications();

        if (response.success) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Fetch notifications error:", error);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    setMarkingNotificationId(notificationId);
    setActionError("");

    try {
      const response = await markNotificationAsRead(notificationId);

      if (response.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  status: "READ",
                  readAt: new Date().toISOString(),
                }
              : notification,
          ),
        );

        await refreshUnreadCount();
      } else {
        setActionError("Failed to mark notification as read.");
      }
    } catch (error) {
      console.error("Mark notification as read error:", error);
      setActionError("Something went wrong. Please try again.");
    } finally {
      setMarkingNotificationId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    setActionError("");

    try {
      const response = await markAllNotificationsAsRead();

      if (response.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            status: "READ",
            readAt: notification.readAt || new Date().toISOString(),
          })),
        );

        await refreshUnreadCount();
      } else {
        setActionError("Failed to mark all notifications as read.");
      }
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      setActionError("Something went wrong. Please try again.");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();

    setPublishing(true);
    setPublishError("");
    setPublishSuccess("");

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: formData.priority,
      };

      // Only Super Admins can select a community.
      if (user?.role === "SUPER_ADMIN" && formData.communityId) {
        notificationData.communityId = formData.communityId;
      }

      // Only include recipientRole when a group has been selected.
      if (formData.recipientRole) {
        notificationData.recipientRole = formData.recipientRole;
      }

      const response = await createNotification(notificationData);

      if (response.success) {
        setPublishSuccess("Notification published successfully.");

        setFormData({
          title: "",
          message: "",
          type: "ANNOUNCEMENT",
          priority: "NORMAL",
          communityId: "",
          recipientRole: "",
        });

        setShowComposeForm(false);
      }
    } catch (error) {
      console.error("Create notification error:", error);
      setPublishError(
        error.message || "Failed to publish notification. Please try again.",
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>

      <p className="mt-2 text-gray-600">
        View your SafeCircle notifications here.
      </p>

      {(user?.role === "SUPER_ADMIN" || user?.role === "COMMUNITY_ADMIN") && (
        <button
          type="button"
          onClick={() => {
            setShowComposeForm(!showComposeForm);
            setPublishError("");
            setPublishSuccess("");
          }}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {showComposeForm ? "Close Form" : "Compose Notification"}
        </button>
      )}

      {showComposeForm && (
        <form
          onSubmit={handleCreateNotification}
          className="mt-6 bg-white border rounded-lg p-6 space-y-5"
        >
          <h2 className="text-lg font-semibold text-gray-800">
            Create Notification
          </h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              minLength={3}
              maxLength={100}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter notification title"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              minLength={3}
              maxLength={1000}
              rows={4}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Write your notification..."
            />
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="SECURITY_ALERT">Security Alert</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Community - Super Admin only */}
          {user?.role === "SUPER_ADMIN" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Community
              </label>
              <select
                value={formData.communityId}
                onChange={(e) =>
                  setFormData({ ...formData, communityId: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Communities (System-wide)</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Send To
            </label>
            <select
              value={formData.recipientRole}
              onChange={(e) =>
                setFormData({ ...formData, recipientRole: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">All Eligible Recipients</option>
              {user?.role === "SUPER_ADMIN" && (
                <option value="COMMUNITY_ADMIN">Community Admins</option>
              )}
              <option value="RESIDENT">Residents</option>
              <option value="SECURITY_PERSONNEL">Security Personnel</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={publishing}
              className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Publish Notification"}
            </button>
          </div>
        </form>
      )}

      {publishSuccess && (
        <p className="mt-4 text-sm text-green-600">{publishSuccess}</p>
      )}

      {publishError && (
        <p className="mt-4 text-sm text-red-600">{publishError}</p>
      )}

      {actionError && (
        <p className="mt-4 text-sm text-red-600">{actionError}</p>
      )}

      {notifications.some(
        (notification) => notification.status === "UNREAD",
      ) && (
        <button
          onClick={handleMarkAllAsRead}
          disabled={markingAll || markingNotificationId !== null}
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {markingAll ? "Marking all as read..." : "Mark All as Read"}
        </button>
      )}

      {loading && (
        <p className="mt-6 text-gray-600">Loading notifications...</p>
      )}

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p className="mt-6 text-gray-600">You have no notifications yet.</p>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${
                notification.status === "UNREAD"
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {notification.type.replace("_", " ")}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    notification.priority === "CRITICAL"
                      ? "bg-red-100 text-red-700"
                      : notification.priority === "HIGH"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {notification.priority}
                </span>
              </div>
              <h2 className="font-semibold text-gray-800">
                {notification.title}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {notification.message}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Received: {new Date(notification.createdAt).toLocaleString()}
              </p>

              <p
                className={`mt-3 text-xs font-semibold ${
                  notification.status === "UNREAD"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {notification.status}
              </p>
              {notification.status === "UNREAD" && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={markingNotificationId !== null || markingAll}
                  className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {markingNotificationId === notification.id
                    ? "Marking as read..."
                    : "Mark as Read"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;

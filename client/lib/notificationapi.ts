const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://cars24-iq0g.onrender.com/api";

export interface NotificationPreferences {
  appointmentConfirmations: boolean;
  bidUpdates: boolean;
  priceDrops: boolean;
  newMessages: boolean;

  pushEnabled: boolean;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  eventType: "appointment_confirmation" | "bid_update" | "price_drop" | "new_message" | string;
  channel: string;
  data: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export const registerFcmToken = async (userId: string, token: string) => {
  try {
    const res = await fetch(`${API_BASE}/notification/register-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for FCM token registration:", error);
    return null;
  }
};

export const unregisterFcmToken = async (userId: string, token: string) => {
  try {
    const res = await fetch(`${API_BASE}/notification/unregister-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for FCM token unregistration:", error);
    return null;
  }
};

export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    const res = await fetch(`${API_BASE}/notification/preferences/${userId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for notification preferences:", error);
    return null;
  }
};

export const updateNotificationPreferences = async (
  userId: string,
  preferences: NotificationPreferences
): Promise<{ message: string; preferences: NotificationPreferences }> => {
  try {
    const res = await fetch(`${API_BASE}/notification/preferences/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });
    if (!res.ok) {
      return { message: "Local settings saved (Backend offline)", preferences };
    }
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for updating preferences:", error);
    return { message: "Local settings saved (Backend offline)", preferences };
  }
};

export const getUserNotifications = async (userId: string): Promise<NotificationItem[]> => {
  try {
    const res = await fetch(`${API_BASE}/notification/user/${userId}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for fetching notifications:", error);
    return [];
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE}/notification/${id}/read`, {
      method: "PUT",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for marking notification read:", error);
    return null;
  }
};

export const markAllNotificationsRead = async (userId: string) => {
  try {
    const res = await fetch(`${API_BASE}/notification/user/${userId}/read-all`, {
      method: "PUT",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for marking all notifications read:", error);
    return null;
  }
};

export const triggerTestNotification = async (
  userId: string,
  eventType: string,
  title?: string,
  message?: string,
  customData?: Record<string, string>
) => {
  try {
    const res = await fetch(`${API_BASE}/notification/test-trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, eventType, title, message, customData }),
    });
    if (!res.ok) {
      return { sent: false, message: "Backend API offline or unreachable." };
    }
    return await res.json();
  } catch (error) {
    console.warn("API server unreachable for test notification trigger:", error);
    return { sent: false, message: "Backend API offline or unreachable." };
  }
};

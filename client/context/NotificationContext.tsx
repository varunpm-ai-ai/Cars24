"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  NotificationPreferences,
  NotificationItem,
  getNotificationPreferences,
  updateNotificationPreferences,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  registerFcmToken,
  triggerTestNotification
} from "@/lib/notificationapi";
import { requestFcmToken, onForegroundMessage } from "@/lib/firebase";
import { toast } from "sonner";

interface NotificationContextType {
  preferences: NotificationPreferences;
  notifications: NotificationItem[];
  unreadCount: number;
  fcmToken: string | null;
  permissionStatus: NotificationPermission | "default";
  loading: boolean;
  requestPermission: () => Promise<boolean>;
  updatePreferences: (newPrefs: NotificationPreferences) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendTestNotification: (
    eventType: string,
    title?: string,
    message?: string,
    customData?: Record<string, string>
  ) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const defaultPreferences: NotificationPreferences = {
  appointmentConfirmations: true,
  bidUpdates: true,
  priceDrops: true,
  newMessages: true,
  pushEnabled: true,
  inAppEnabled: true,
  emailEnabled: true,
  smsEnabled: true,
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | "default">("default");
  const [loading, setLoading] = useState<boolean>(false);

  // Check initial notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Fetch notifications and preferences when user is logged in
  const refreshNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const items = await getUserNotifications(user.id);
      setNotifications(items);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }, [user?.id]);

  const loadUserPreferences = useCallback(async () => {
    if (!user?.id) return;
    try {
      const prefs = await getNotificationPreferences(user.id);
      if (prefs) {
        setPreferences(prefs);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  }, [user?.id]);

  // Request FCM token and register with backend
  const setupFcm = useCallback(async () => {
    if (!user?.id) return;
    try {
      const token = await requestFcmToken();
      if (token) {
        setFcmToken(token);
        await registerFcmToken(user.id, token);
      }
    } catch (err) {
      console.error("FCM setup failed:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadUserPreferences();
      refreshNotifications();

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        setupFcm();
      }
    } else {
      setNotifications([]);
      setFcmToken(null);
    }
  }, [user?.id, loadUserPreferences, refreshNotifications, setupFcm]);

  // Handle Foreground Messages from FCM
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const listen = async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        console.log("Foreground Push Received:", payload);
        const title = payload.notification?.title || payload.data?.title || "Cars24 Alert";
        const body = payload.notification?.body || payload.data?.body || "";

        toast.info(title, {
          description: body,
          action: {
            label: "View Inbox",
            onClick: () => {
              if (typeof window !== "undefined") {
                window.location.href = "/profile/notifications";
              }
            },
          },
        });

        refreshNotifications();
      });
    };

    listen();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [refreshNotifications]);

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser push notifications are not supported in this browser.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === "granted") {
        toast.success("Notification permission granted!");
        await setupFcm();
        return true;
      } else {
        toast.error("Notification permission was denied.");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to request notification permission.");
      return false;
    }
  };

  const updatePreferencesHandler = async (newPrefs: NotificationPreferences) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await updateNotificationPreferences(user.id, newPrefs);
      setPreferences(res.preferences);
      toast.success("Notification preferences updated!");
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Failed to save notification preferences.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await markAllNotificationsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const sendTestNotification = async (
    eventType: string,
    title?: string,
    message?: string,
    customData?: Record<string, string>
  ) => {
    if (!user?.id) {
      toast.error("Please log in to test push notifications.");
      return;
    }

    try {
      const res = await triggerTestNotification(user.id, eventType, title, message, customData);
      if (res.sent) {
        toast.success("Test notification triggered! FCM push and inbox updated.");
        refreshNotifications();
      } else {
        toast.info(res.message || "Notification skipped based on your current preference settings.");
      }
    } catch (error) {
      console.error("Test notification failed:", error);
      toast.error("Failed to send test notification.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        preferences,
        notifications,
        unreadCount,
        fcmToken,
        permissionStatus,
        loading,
        requestPermission,
        updatePreferences: updatePreferencesHandler,
        markAsRead,
        markAllAsRead,
        sendTestNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

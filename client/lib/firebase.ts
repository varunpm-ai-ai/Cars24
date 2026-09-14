import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyAd7f4oQ5Aw0fW1dZ2a8O5Qp7VexauWE7o",
  authDomain: "cars24-c182f.firebaseapp.com",
  projectId: "cars24-c182f",
  storageBucket: "cars24-c182f.firebasestorage.app",
  messagingSenderId: "715449567619",
  appId: "1:715449567619:web:9f1c677674ecd11d16ceb6",
  measurementId: "G-6XZLENVR4E"
};

export const VAPID_KEY = "BCK9idQQ0uI-hPXv9dKPDY2rpUXiyCBOVZHTXW9PlssQMDzYipNeyxtGmkxfmSfyhQAKG_vdQyndr6QmZt4IXBI";

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const requestFcmToken = async (): Promise<string | null> => {
  try {
    if (typeof window === "undefined") return null;

    const supported = await isSupported();
    if (!supported) {
      console.warn("FCM is not supported in this browser environment.");
      return null;
    }

    // Register service worker if not already registered
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready;

      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        return token;
      } else {
        console.warn("No registration token available. Request permission to generate one.");
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("An error occurred while retrieving FCM token:", error);
    return null;
  }
};

export const onForegroundMessage = async (callback: (payload: any) => void) => {
  try {
    if (typeof window === "undefined") return () => {};
    const supported = await isSupported();
    if (!supported) return () => {};

    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      callback(payload);
    });
  } catch (error) {
    console.error("Error setting up foreground message listener:", error);
    return () => {};
  }
};

"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Fotter from "@/components/Fotter";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  Calendar,
  Gavel,
  Tag,
  MessageSquare,
  Smartphone,
  Mail,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowLeft,
  CheckCheck,
  ShieldCheck,
  Radio,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NotificationPreferencesPage() {
  const { user } = useAuth();
  const {
    preferences,
    updatePreferences,
    permissionStatus,
    requestPermission,
    fcmToken,
    notifications,
    markAsRead,
    markAllAsRead,
    sendTestNotification,
    loading,
  } = useNotifications();

  // State for test notification simulation form
  const [testEventType, setTestEventType] = useState<string>("appointment_confirmation");
  const [testTitle, setTestTitle] = useState<string>("");
  const [testMessage, setTestMessage] = useState<string>("");
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  const handleToggleEvent = (key: keyof typeof preferences) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key],
    };
    updatePreferences(updated);
  };

  const handleTriggerTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to send test push notifications.");
      return;
    }

    setIsSendingTest(true);
    try {
      await sendTestNotification(
        testEventType,
        testTitle || undefined,
        testMessage || undefined
      );
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {/* Top Breadcrumb & Page Header */}
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <Bell className="h-8 w-8 text-orange-500" />
                Real-Time Push Notification Settings
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Customize key event triggers (FCM push, bid updates, appointment confirmations) and delivery channels.
              </p>
            </div>
          </div>
        </div>

        {/* FCM Web Push Permission Status Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div
                className={`p-3.5 rounded-2xl border ${
                  permissionStatus === "granted"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : permissionStatus === "denied"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                }`}
              >
                {permissionStatus === "granted" ? (
                  <ShieldCheck className="h-7 w-7" />
                ) : (
                  <AlertTriangle className="h-7 w-7" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900">
                    Firebase Push Notification Status
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      permissionStatus === "granted"
                        ? "bg-emerald-100 text-emerald-800"
                        : permissionStatus === "denied"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {permissionStatus === "granted"
                      ? "Active & Connected"
                      : permissionStatus === "denied"
                      ? "Blocked in Browser"
                      : "Permission Required"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {permissionStatus === "granted"
                    ? "Your browser is registered to receive instant FCM web push notifications for important updates."
                    : permissionStatus === "denied"
                    ? "Push notifications are blocked in browser settings. Please enable notification permissions in your browser address bar to receive alerts."
                    : "Grant browser permission to receive instant pop-up push notifications for appointment confirmations, bid updates, and price drops."}
                </p>

                {fcmToken && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2 max-w-xl text-[11px] font-mono text-gray-500 overflow-hidden">
                    <Radio className="h-3.5 w-3.5 text-emerald-500 shrink-0 animate-pulse" />
                    <span className="truncate">FCM Token: {fcmToken}</span>
                  </div>
                )}
              </div>
            </div>

            {permissionStatus !== "granted" && (
              <button
                onClick={requestPermission}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 text-sm"
              >
                <Sparkles className="h-4 w-4" />
                Enable Web Push
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Main Controls: Events & Channels (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Event Triggers */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Key Event Triggers
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select which platform events automatically send push alerts to your devices.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "appointmentConfirmations" as const,
                    title: "Appointment Confirmations",
                    desc: "Get notified when test drives, car inspections, or home delivery slots are confirmed.",
                    icon: Calendar,
                    badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
                  },
                  {
                    key: "bidUpdates" as const,
                    title: "Bid Updates & Auction Alerts",
                    desc: "Real-time updates when new bids are placed or when you get outbid on car auctions.",
                    icon: Gavel,
                    badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
                  },
                  {
                    key: "priceDrops" as const,
                    title: "Price Drop Alerts",
                    desc: "Receive immediate notifications when cars in your saved wishlist drop in price.",
                    icon: Tag,
                    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
                  },
                  {
                    key: "newMessages" as const,
                    title: "New Chat Messages",
                    desc: "Stay informed when car sellers, verified buyers, or Cars24 support send you a message.",
                    icon: MessageSquare,
                    badgeColor: "bg-purple-50 text-purple-600 border-purple-200",
                  },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isChecked = preferences[item.key];

                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleEvent(item.key)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isChecked
                          ? "bg-white border-blue-200 shadow-sm hover:border-blue-300"
                          : "bg-gray-50/50 border-gray-200 opacity-65 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <div
                          className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${item.badgeColor}`}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Custom Toggle Switch */}
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isChecked ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        role="switch"
                        aria-checked={isChecked}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isChecked ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Delivery Channels */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-indigo-600" />
                  Preferred Delivery Channels
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose how updates are delivered to you across desktop, mobile, and communication apps.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "pushEnabled" as const,
                    title: "Browser & Mobile Push (FCM)",
                    desc: "Real-time pop-up notifications via Firebase Cloud Messaging.",
                    icon: Smartphone,
                  },
                  {
                    key: "inAppEnabled" as const,
                    title: "In-App Bell Inbox",
                    desc: "Unread notification badge & interactive feed inside app header.",
                    icon: Bell,
                  },
                  {
                    key: "emailEnabled" as const,
                    title: "Email Digests",
                    desc: "Important event summaries sent directly to your registered email.",
                    icon: Mail,
                  },
                  {
                    key: "smsEnabled" as const,
                    title: "SMS Notifications",
                    desc: "Instant text messages sent to your mobile phone number.",
                    icon: MessageCircle,
                  },
                ].map((channel) => {
                  const IconComp = channel.icon;
                  const isChecked = preferences[channel.key];

                  return (
                    <div
                      key={channel.key}
                      onClick={() => handleToggleEvent(channel.key)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? "bg-blue-50/30 border-blue-200"
                          : "bg-gray-50/50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <IconComp className="h-4 w-4 text-blue-600" />
                          <h4 className="font-semibold text-xs text-gray-900">
                            {channel.title}
                          </h4>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500">{channel.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Push Simulator / Test Station (1 col) */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl p-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

              <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm mb-2">
                <Radio className="h-4 w-4 animate-pulse" />
                <span>LIVE PUSH TESTER</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                Test Real-Time Notifications
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Simulate backend event triggers to verify Firebase Cloud Messaging push delivery in real-time.
              </p>

              <form onSubmit={handleTriggerTest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Event Type
                  </label>
                  <select
                    value={testEventType}
                    onChange={(e) => setTestEventType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="appointment_confirmation">📅 Appointment Confirmation</option>
                    <option value="bid_update">🔨 Bid Update / Outbid Alert</option>
                    <option value="price_drop">🏷️ Price Drop Alert</option>
                    <option value="new_message">💬 New Chat Message</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Custom Notification Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty for default title"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Custom Message Body (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Leave empty for default message"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSendingTest ? "Sending FCM Push..." : "Trigger FCM Push Alert"}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Triggers .NET Firebase Admin SDK</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Dispatches FCM Web Push Notification</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Updates In-App Bell Count & Inbox</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Inbox Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Notification Inbox & History
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                View your recent notification logs across all devices.
              </p>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 self-start sm:self-auto bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <CheckCheck className="h-4 w-4" />
                Mark All as Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Inbox is clean!</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                No notifications logged yet. Try triggering a test push notification above or book a car appointment!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`py-4 px-3 rounded-xl transition-colors flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50 ${
                    !n.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600 shrink-0 mt-0.5">
                      {n.eventType === "appointment_confirmation" && <Calendar className="h-4 w-4 text-blue-600" />}
                      {n.eventType === "bid_update" && <Gavel className="h-4 w-4 text-amber-600" />}
                      {n.eventType === "price_drop" && <Tag className="h-4 w-4 text-emerald-600" />}
                      {n.eventType === "new_message" && <MessageSquare className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">{n.title}</h4>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                          {n.eventType.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                      <span className="text-[11px] text-gray-400 mt-1.5 block">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!n.isRead ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shrink-0 mt-2" title="Unread" />
                  ) : (
                    <span title="Read">
                      <CheckCircle2 className="h-4 w-4 text-gray-300 shrink-0 mt-2" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Fotter />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  Gavel,
  Tag,
  MessageSquare,
  Settings,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendTestNotification,
    permissionStatus,
    requestPermission,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<string>("all");

  if (!user) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.eventType === activeFilter;
  });

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case "appointment_confirmation":
        return {
          icon: Calendar,
          color: "text-blue-600 bg-blue-50 border-blue-200",
          label: "Appointment",
        };
      case "bid_update":
        return {
          icon: Gavel,
          color: "text-amber-600 bg-amber-50 border-amber-200",
          label: "Bid Update",
        };
      case "price_drop":
        return {
          icon: Tag,
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          label: "Price Drop",
        };
      case "new_message":
        return {
          icon: MessageSquare,
          color: "text-purple-600 bg-purple-50 border-purple-200",
          label: "Message",
        };
      default:
        return {
          icon: Info,
          color: "text-gray-600 bg-gray-50 border-gray-200",
          label: "Update",
        };
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 focus:outline-none transition-colors"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 shadow-2xl rounded-2xl border border-gray-100 overflow-hidden bg-white z-50"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-400" />
            <h3 className="font-semibold text-base">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="text-xs text-blue-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <Link
              href="/profile/notifications"
              className="p-1.5 rounded-md hover:bg-white/10 text-blue-200 hover:text-white transition-colors"
              title="Notification Preferences"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Permission Request Banner if not granted */}
        {permissionStatus !== "granted" && (
          <div className="bg-amber-50 border-b border-amber-100 p-3 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Enable push notifications for instant alerts.</span>
            </div>
            <button
              onClick={requestPermission}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-2.5 py-1 rounded-md transition-colors shrink-0"
            >
              Enable
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-100 overflow-x-auto text-xs no-scrollbar">
          {[
            { id: "all", label: "All" },
            { id: "appointment_confirmation", label: "📅 Appointments" },
            { id: "bid_update", label: "🔨 Bids" },
            { id: "price_drop", label: "🏷️ Price Drops" },
            { id: "new_message", label: "💬 Messages" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                activeFilter === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification Feed */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 px-4 text-center">
              <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                We'll notify you when appointment confirmations, bids, or price drops happen.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const badge = getEventBadge(item.eventType);
              const IconComp = badge.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  className={`p-3 transition-colors flex items-start space-x-3 cursor-pointer hover:bg-gray-50/80 ${
                    !item.isRead ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl border shrink-0 mt-0.5 ${badge.color}`}
                  >
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span
                      title="Unread"
                      className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Quick Test Trigger Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">Test Real-time Push:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                sendTestNotification(
                  "appointment_confirmation",
                  "Appointment Confirmed! 📅",
                  "Your test drive appointment for Honda City is scheduled for tomorrow."
                )
              }
              className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-gray-700 font-medium transition-colors"
              title="Test Appointment Push"
            >
              📅 Test
            </button>
            <button
              onClick={() =>
                sendTestNotification(
                  "price_drop",
                  "Price Drop Alert! 🏷️",
                  "Maruti Swift in your wishlist dropped by ₹15,000!"
                )
              }
              className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-gray-700 font-medium transition-colors"
              title="Test Price Drop Push"
            >
              🏷️ Test
            </button>
            <Link
              href="/profile/notifications"
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center gap-0.5 transition-colors ml-1"
            >
              <span>Preferences</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

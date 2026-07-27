"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("login");
    router.replace("/");
  }, [openAuthModal, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-gray-600">Opening login overlay...</p>
      </div>
    </div>
  );
}

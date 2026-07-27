"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "@/lib/userapi";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode?: "login" | "signup", callback?: () => void) => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: { fullName: string; phone: string }
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const openAuthModal = (
    mode: "login" | "signup" = "login",
    callback?: () => void
  ) => {
    setAuthModalMode(mode);
    if (callback) {
      setOnAuthSuccessCallback(() => callback);
    } else {
      setOnAuthSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setOnAuthSuccessCallback(null);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData.user);
      localStorage.setItem("user", JSON.stringify(userData.user));
      setIsAuthModalOpen(false);
      if (onAuthSuccessCallback) {
        onAuthSuccessCallback();
        setOnAuthSuccessCallback(null);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: { fullName: string; phone: string }
  ) => {
    setLoading(true);
    try {
      const newUser = await api.signup(email, password, userData);
      setUser(newUser.user);
      localStorage.setItem("user", JSON.stringify(newUser.user));
      setIsAuthModalOpen(false);
      if (onAuthSuccessCallback) {
        onAuthSuccessCallback();
        setOnAuthSuccessCallback(null);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
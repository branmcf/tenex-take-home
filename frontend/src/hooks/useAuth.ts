"use client";

import { useState, useCallback } from "react";

export type AuthProvider = "email" | "google" | "github";

export interface User {
  id: string;
  email: string;
  name: string;
  initials: string;
  provider: AuthProvider;
  plan: "free" | "plus" | "pro";
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Mock user data - replace with actual auth implementation
const mockUser: User = {
  id: "1",
  email: "brandon@example.com",
  name: "Brandon McFarland",
  initials: "BM",
  provider: "email",
  plan: "plus",
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    // Mock API call - replace with actual sign out
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    setIsLoading(false);
    // In a real app, redirect to login page
    window.location.href = "/login";
  }, []);

  const updateEmail = useCallback(async (newEmail: string) => {
    setIsLoading(true);
    // Mock API call - replace with actual email update
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate validation
    if (!newEmail.includes("@")) {
      setIsLoading(false);
      throw new Error("Invalid email address");
    }

    // Update user state with new email
    setUser((prev) => (prev ? { ...prev, email: newEmail } : null));
    setIsLoading(false);
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setIsLoading(true);
      // Mock API call - replace with actual password change
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate validation
      if (currentPassword.length < 1) {
        setIsLoading(false);
        throw new Error("Current password is required");
      }
      if (newPassword.length < 8) {
        setIsLoading(false);
        throw new Error("New password must be at least 8 characters");
      }

      setIsLoading(false);
    },
    []
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    updateEmail,
    changePassword,
  };
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks";

const PUBLIC_ROUTES = ["/login", "/signup", "/verify-email"];

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    // If not authenticated and trying to access protected route, redirect to login
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }

    // If authenticated and on login/signup, redirect to home
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);

  // Show nothing while loading or redirecting
  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  // If not authenticated and not on public route, don't render children (redirect will happen)
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // If authenticated and on login/signup, don't render children (redirect will happen)
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return null;
  }

  return <>{children}</>;
}

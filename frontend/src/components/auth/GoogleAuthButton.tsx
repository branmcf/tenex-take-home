"use client";

import { useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/auth-client";
import { handleAndShowError, processBetterAuthResult } from "@/lib/errors";

interface GoogleAuthButtonProps {
  className?: string;
  mode?: "login" | "signup";
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

export function GoogleAuthButton({ className, mode = "login" }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);

    try {
      // Use full frontend URL for callback after OAuth
      const callbackURL = typeof window !== "undefined"
        ? `${window.location.origin}/`
        : "/";

      const result = await signIn.social({
        provider: "google",
        callbackURL,
      });

      // Check for errors in the result (though social sign-in typically redirects)
      const error = processBetterAuthResult(result, {
        action: mode === "signup" ? "google_signup" : "google_login",
        provider: "google",
      });

      if (error) {
        // Error was already logged and toast shown
        return;
      }

      // If we get here without redirect, something unexpected happened
      // The signIn.social should redirect to Google
    } catch (err) {
      // Handle unexpected errors (network, CORS, etc.)
      handleAndShowError(err, {
        action: mode === "signup" ? "google_signup" : "google_login",
        provider: "google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={cn("w-full", className)}
      onClick={handleGoogleAuth}
      disabled={isLoading}
      type="button"
    >
      {isLoading ? (
        <CircleNotch className="size-4 animate-spin" />
      ) : (
        <GoogleIcon className="size-4" />
      )}
      {mode === "signup" ? "Sign up with Google" : "Login with Google"}
    </Button>
  );
}

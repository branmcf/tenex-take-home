"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md border border-destructive/50 bg-card p-8">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-destructive bg-destructive/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="mb-2 text-center text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          An unexpected error occurred while rendering this page.
        </p>

        {/* Error Details (development only) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 border border-border bg-muted p-3">
            <p className="font-mono text-xs text-muted-foreground break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Go to home
          </Button>
        </div>
      </div>

      {/* Grid pattern hint */}
      <p className="mt-8 text-xs text-muted-foreground">
        If this problem persists, please contact support.
      </p>
    </div>
  );
}

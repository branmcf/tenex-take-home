"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fafafa",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            padding: "2rem",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            backgroundColor: "#171717",
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "4rem",
                width: "4rem",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: "2rem", width: "2rem", color: "#ef4444" }}
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
          <h1
            style={{
              marginBottom: "0.5rem",
              textAlign: "center",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Critical Error
          </h1>
          <p
            style={{
              marginBottom: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#a3a3a3",
            }}
          >
            A critical error occurred in the application.
          </p>

          {/* Error Details (development only) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div
              style={{
                marginBottom: "1.5rem",
                padding: "0.75rem",
                border: "1px solid #262626",
                backgroundColor: "#262626",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#a3a3a3",
                  wordBreak: "break-all",
                  margin: 0,
                }}
              >
                {error.message}
              </p>
              {error.digest && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "#a3a3a3",
                    margin: "0.5rem 0 0 0",
                  }}
                >
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={reset}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#fff",
                backgroundColor: "hsl(161, 89%, 35%)",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "hsl(161, 89%, 30%)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "hsl(161, 89%, 35%)")
              }
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#fafafa",
                backgroundColor: "transparent",
                border: "1px solid #262626",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#262626")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Go to home
            </button>
          </div>
        </div>

        {/* Support message */}
        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.75rem",
            color: "#a3a3a3",
          }}
        >
          If this problem persists, please contact support.
        </p>
      </body>
    </html>
  );
}

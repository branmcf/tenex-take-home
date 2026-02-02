"use client";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
};

interface LoaderProps {
  variant?: "pulse-dot";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loader({
  variant = "pulse-dot",
  size = "md",
  className,
}: LoaderProps) {
  if (variant === "pulse-dot") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-full bg-current",
              sizeClasses[size]
            )}
            style={{
              animation: "pulse-dot 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemedAuthImageProps {
  alt: string;
  className?: string;
}

export function ThemedAuthImage({ alt, className }: ThemedAuthImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  // Avoid hydration mismatch - don't render anything until mounted
  React.useEffect(() => {
    setMounted(true);
    // Trigger fade-in after a brief delay to ensure smooth animation
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <div className={cn("relative h-full w-full", className)}>
      {/* Only render images after mount to prevent flash */}
      {mounted && (
        <>
          {/* Light image */}
          <Image
            src="/dither_light.svg"
            alt={alt}
            fill
            className={cn(
              "object-cover transition-opacity duration-1000 ease-out",
              visible && !isDark ? "opacity-100" : "opacity-0"
            )}
            priority
          />
          {/* Dark image */}
          <Image
            src="/dither_dark.svg"
            alt={alt}
            fill
            className={cn(
              "object-cover transition-opacity duration-1000 ease-out",
              visible && isDark ? "opacity-100" : "opacity-0"
            )}
            priority
          />
        </>
      )}

      {/* Gradient overlay - fades from solid to transparent left-to-right */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out",
          visible ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "linear-gradient(to right, hsl(var(--background)) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

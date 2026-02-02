"use client";

import * as React from "react";
import { Sparkle, ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What can you help me with?",
  "Write a Python function to calculate fibonacci",
  "Explain how React hooks work",
  "Help me debug my code",
];

interface WelcomeScreenProps {
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export function WelcomeScreen({
  onSuggestionClick,
  className,
}: WelcomeScreenProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center px-4",
        className
      )}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkle className="h-6 w-6 text-primary" weight="fill" />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Welcome to B-Plex
        </h2>

        <p className="mb-8 text-sm text-muted-foreground">
          Start a conversation or try one of these suggestions
        </p>

        <div className="w-full space-y-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm",
                "rounded-lg border border-border bg-background",
                "transition-colors hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <span className="line-clamp-1">{suggestion}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

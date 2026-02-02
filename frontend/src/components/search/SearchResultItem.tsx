"use client";

import * as React from "react";
import Link from "next/link";
import { ChatCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface SearchResultItemData {
  id: string;
  title: string | null;
  snippet?: string;
  updatedAt: Date;
}

interface SearchResultItemProps {
  item: SearchResultItemData;
  isSelected?: boolean;
  showDateAlways?: boolean;
  onClick?: () => void;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function SearchResultItem({
  item,
  isSelected,
  showDateAlways = false,
  onClick,
}: SearchResultItemProps) {
  const displayTitle = item.title || "New chat";
  const formattedDate = formatDate(item.updatedAt);

  return (
    <Link
      href={`/chat/${item.id}`}
      onClick={onClick}
      className={cn(
        "group/result flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
        "hover:bg-accent",
        "focus-visible:ring-2 focus-visible:ring-ring",
        isSelected && "bg-accent"
      )}
    >
      <ChatCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "truncate font-medium text-foreground",
              (showDateAlways || item.snippet) && "max-w-[calc(100%-4rem)]",
              !showDateAlways && !item.snippet && "group-hover/result:max-w-[calc(100%-4rem)]"
            )}
          >
            {displayTitle}
          </span>
          <span
            className={cn(
              "ml-auto shrink-0 text-xs text-muted-foreground transition-opacity",
              showDateAlways ? "opacity-100" : "opacity-0 group-hover/result:opacity-100",
              isSelected && "opacity-100"
            )}
          >
            {formattedDate}
          </span>
        </div>
        {item.snippet && (
          <span className="truncate text-xs text-muted-foreground">
            {item.snippet}
          </span>
        )}
      </div>
    </Link>
  );
}

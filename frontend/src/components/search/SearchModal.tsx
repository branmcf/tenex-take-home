"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PenNib, X } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks";
import { SearchResultItem, type SearchResultItemData } from "./SearchResultItem";
import { groupByDate } from "@/lib/utils/dateGrouping";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chats: SearchResultItemData[];
  isLoading?: boolean;
}

const MAX_RECENT_CHATS = 6;

function SearchSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-3 py-2.5">
          <div className="h-5 w-5 animate-pulse rounded-full bg-muted" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <p className="text-sm text-muted-foreground">No results found</p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        No chats matching &quot;{query}&quot;
      </p>
    </div>
  );
}

export function SearchModal({
  isOpen,
  onClose,
  chats,
  isLoading = false,
}: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isSearching, setIsSearching] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Determine if we're in search mode (has query)
  const isSearchMode = searchQuery.trim().length > 0;

  // Filter chats based on debounced query
  const filteredChats = React.useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (!query) {
      // Pre-search: show most recent 6 chats
      return [...chats]
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, MAX_RECENT_CHATS);
    }
    // Post-search: filter by query
    return chats.filter((chat) => {
      const title = (chat.title || "New chat").toLowerCase();
      const snippet = (chat.snippet || "").toLowerCase();
      return title.includes(query) || snippet.includes(query);
    });
  }, [chats, debouncedQuery]);

  // Group chats by date for display
  const groupedChats = React.useMemo(() => {
    return groupByDate(filteredChats, (chat) => chat.updatedAt);
  }, [filteredChats]);

  // Flatten grouped chats for keyboard navigation
  const flatChats = React.useMemo(() => {
    return groupedChats.flatMap((group) => group.items);
  }, [groupedChats]);

  // Handle loading state when query changes
  React.useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, debouncedQuery]);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(-1);
      // Focus input after a brief delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const totalItems = flatChats.length + (isSearchMode ? 0 : 1); // +1 for "New chat" in pre-search

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex === -1) return;

        if (!isSearchMode && selectedIndex === 0) {
          // "New chat" is selected
          router.push("/chat/new");
          onClose();
        } else {
          // Chat item is selected
          const chatIndex = isSearchMode ? selectedIndex : selectedIndex - 1;
          const selectedChat = flatChats[chatIndex];
          if (selectedChat) {
            router.push(`/chat/${selectedChat.id}`);
            onClose();
          }
        }
        break;
    }
  };

  // Scroll selected item into view
  React.useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleItemClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  const showLoading = isLoading || isSearching;
  const showEmpty = !showLoading && isSearchMode && filteredChats.length === 0;
  const showResults = !showLoading && !showEmpty;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]"
        style={{ height: "min(480px, 70vh)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Search chats"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search chats..."
            className="h-10 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="size-4" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>

        {/* Results Area */}
        <div
          ref={resultsRef}
          className="flex-1 overflow-y-auto"
        >
          {/* New Chat Option - Only shown in pre-search state */}
          {!isSearchMode && (
            <div className="border-b border-border p-2">
              <Link
                href="/chat/new"
                onClick={handleItemClick}
                data-index={0}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
                  "hover:bg-accent",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  selectedIndex === 0 && "bg-accent"
                )}
              >
                <PenNib className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">New chat</span>
              </Link>
            </div>
          )}

          {/* Loading State */}
          {showLoading && <SearchSkeleton />}

          {/* Empty State */}
          {showEmpty && <EmptyState query={debouncedQuery} />}

          {/* Results */}
          {showResults && (
            <div className="p-2">
              {groupedChats.map((group) => {
                // Calculate the starting index for items in this group
                let runningIndex = isSearchMode ? 0 : 1; // Account for "New chat"
                for (const g of groupedChats) {
                  if (g.group === group.group) break;
                  runningIndex += g.items.length;
                }

                return (
                  <div key={group.group} className="mb-4 last:mb-0">
                    <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                      {group.group}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((chat, itemIndex) => {
                        const globalIndex = runningIndex + itemIndex;
                        return (
                          <div
                            key={chat.id}
                            data-index={globalIndex}
                          >
                            <SearchResultItem
                              item={chat}
                              isSelected={selectedIndex === globalIndex}
                              showDateAlways={isSearchMode}
                              onClick={handleItemClick}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

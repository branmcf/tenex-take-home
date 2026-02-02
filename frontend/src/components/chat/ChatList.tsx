"use client";

import * as React from "react";
import Link from "next/link";
import { DotsThree, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ChatListItemData {
  id: string;
  title: string | null;
  updatedAt: Date;
}

interface ChatListItemProps {
  chat: ChatListItemData;
  isActive?: boolean;
  onDelete?: (chatId: string) => void;
}

function ChatListItem({ chat, isActive, onDelete }: ChatListItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const displayTitle = chat.title || "New chat";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(chat.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="group/chat-item relative flex items-center">
        <Link
          href={`/chats/${chat.id}`}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-2 pr-8 text-sm text-sidebar-foreground outline-none transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            isActive &&
              "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          )}
        >
          <span className="min-w-0 flex-1 truncate">{displayTitle}</span>
        </Link>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-1 top-1/2 h-6 w-6 shrink-0 -translate-y-1/2 opacity-0 transition-opacity",
                "group-hover/chat-item:opacity-100 group-focus-within/chat-item:opacity-100",
                "focus-visible:opacity-100",
                dropdownOpen && "opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <DotsThree className="h-4 w-4" weight="bold" />
              <span className="sr-only">Chat options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right">
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleDeleteClick}
            >
              <Trash className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface ChatListProps {
  chats: ChatListItemData[];
  activeChatId?: string;
  isLoading?: boolean;
  onDeleteChat?: (chatId: string) => void;
  grouped?: boolean;
  className?: string;
}

function ChatListSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-9 animate-pulse rounded-md bg-sidebar-accent/50"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">No conversations yet</p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Start a new chat to begin
      </p>
    </div>
  );
}

export function ChatList({
  chats,
  activeChatId,
  isLoading = false,
  onDeleteChat,
  grouped = false,
  className,
}: ChatListProps) {
  const sortedChats = React.useMemo(() => {
    return [...chats].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [chats]);

  const groupedChats = React.useMemo(() => {
    if (!grouped || sortedChats.length === 0) return [];

    const startOfDay = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const newestDate = startOfDay(sortedChats[0].updatedAt).getTime();
    const sections: Array<{ label: string; chats: ChatListItemData[] }> = [];
    const indexByLabel = new Map<string, number>();

    for (const chat of sortedChats) {
      const diffDays = Math.floor(
        (newestDate - startOfDay(chat.updatedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      let label = "Older";
      if (diffDays === 0) label = "Today";
      else if (diffDays === 1) label = "Yesterday";
      else if (diffDays <= 7) label = "Previous 7 Days";
      else if (diffDays <= 30) label = "Previous 30 Days";

      let sectionIndex = indexByLabel.get(label);
      if (sectionIndex === undefined) {
        sectionIndex = sections.length;
        indexByLabel.set(label, sectionIndex);
        sections.push({ label, chats: [] });
      }
      sections[sectionIndex].chats.push(chat);
    }

    return sections;
  }, [grouped, sortedChats]);

  if (isLoading) {
    return <ChatListSkeleton />;
  }

  if (chats.length === 0) {
    return <EmptyState />;
  }

  if (!grouped) {
    return (
      <nav
        className={cn("flex flex-col gap-0.5", className)}
        aria-label="Chat history"
      >
        {sortedChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onDelete={onDeleteChat}
          />
        ))}
      </nav>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {groupedChats.map((section) => (
        <div key={section.label} className="space-y-1">
          <p className="px-2 text-xs font-medium text-muted-foreground">
            {section.label}
          </p>
          <nav className="flex flex-col gap-0.5" aria-label={section.label}>
            {section.chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onDelete={onDeleteChat}
              />
            ))}
          </nav>
        </div>
      ))}
    </div>
  );
}

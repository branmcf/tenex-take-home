"use client";

import * as React from "react";
import Link from "next/link";
import {
  PenNib,
  MagnifyingGlass,
  GitBranch,
  Stack,
  SidebarSimple,
} from "@phosphor-icons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatList, type ChatListItemData } from "@/components/chat";
import { SearchModal } from "@/components/search";
import { SettingsModal } from "@/components/settings";
import { ThemeToggle } from "@/components/theme-toggle";
import { useChatContext } from "@/contexts";

const BASE_CHAT_TIME = Date.parse("2024-02-01T12:00:00Z");

// Extended mock data with snippets for search
interface MockChat extends ChatListItemData {
  snippet?: string;
}

// Mock data for demonstration - replace with actual data from useChats hook
const mockChats: MockChat[] = [
  { id: "1", title: "Testing GPT", updatedAt: new Date(BASE_CHAT_TIME), snippet: "Let me test this model with a few prompts..." },
  { id: "2", title: "Viewport vs Screen Fixed", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 30), snippet: "The difference between viewport units and fixed positioning..." },
  { id: "3", title: "Font Match and Alternatives", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60), snippet: "Looking for fonts similar to Inter and SF Pro..." },
  { id: "4", title: "Monorepo Setup for FE/BE", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 24), snippet: "Hey, I need help setting up a monorepo structure..." },
  { id: "5", title: "TanStack Query Substitutes", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 25), snippet: "What are some alternatives to TanStack Query?" },
  { id: "6", title: "Onchain Bank for AI", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 48), snippet: "A new agent capability must rely on external constraints..." },
  { id: "7", title: "Crypto Tradfi Intersection Problems", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 72), snippet: "hey, so, I'm an expert in both of these fields..." },
  { id: "8", title: "Targeting Small Businesses", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 96), snippet: "They already pay $250-$600/mo for comms/reviews software..." },
  { id: "9", title: "SMB Manual Task: Bookkeeping", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 120), snippet: "They want recognition, not reflection. Here's what works..." },
  { id: "10", title: "Business Ideas for You", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 144), snippet: "Yet they address serious challenges. For each idea..." },
  { id: "11", title: "Cracking government tech market", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 168), snippet: "They hate structure that asks for too much, too often..." },
  { id: "12", title: "Thesis format development", updatedAt: new Date(BASE_CHAT_TIME - 1000 * 60 * 60 * 192), snippet: "Working on the thesis structure and formatting..." },
];

type NavItem =
  | { title: string; icon: React.ComponentType<{ className?: string }>; url: string }
  | { title: string; icon: React.ComponentType<{ className?: string }>; action: "search" | "newChat" };

const navItems: NavItem[] = [
  { title: "New chat", action: "newChat", icon: PenNib },
  { title: "Search chats", action: "search", icon: MagnifyingGlass },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
];

export function AppSidebar() {
  const [chats, setChats] = React.useState<MockChat[]>(mockChats);
  const [isLoading] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { startNewChat, currentChatId } = useChatContext();

  const handleDeleteChat = React.useCallback((chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  }, []);

  const handleCloseSearch = React.useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const handleCloseSettings = React.useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  // Convert to SearchResultItemData format with snippets
  const searchChats = React.useMemo(() => {
    return chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      snippet: chat.snippet,
      updatedAt: chat.updatedAt,
    }));
  }, [chats]);

  return (
    <Sidebar variant="inset">
      {/* Fixed Header - Logo and Navigation */}
      <SidebarHeader className="pb-0">
        <div className="flex items-center justify-between px-2 py-1">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleSidebar}
                >
                  <SidebarSimple className="size-4" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Open sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 font-medium"
              >
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                  <Stack className="size-4" weight="bold" />
                </div>
                B-Plex
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleSidebar}
                  >
                    <SidebarSimple className="size-4" />
                    <span className="sr-only">Close sidebar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Close sidebar</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {"action" in item ? (
                <SidebarMenuButton
                  onClick={() => {
                    if (item.action === "search") {
                      setIsSearchOpen(true);
                    } else if (item.action === "newChat") {
                      startNewChat();
                    }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>

      {/* Scrollable Chat List */}
      <SidebarContent className="flex flex-col overflow-hidden">
        <SidebarGroup className="flex-1 overflow-hidden px-2">
          <p className="px-2 py-2 text-xs font-medium text-sidebar-foreground/70">
            Your chats
          </p>
          <ChatList
            chats={chats}
            activeChatId={currentChatId ?? undefined}
            isLoading={isLoading}
            onDeleteChat={handleDeleteChat}
            grouped={false}
            className="flex-1 overflow-y-auto"
          />
        </SidebarGroup>
      </SidebarContent>

      {/* Fixed Footer - Account */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-1 w-full">
              <SidebarMenuButton onClick={() => setIsSettingsOpen(true)} className="flex-1 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    BM
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">Brandon McFarland</span>
                  </div>
                </div>
              </SidebarMenuButton>
              {!isCollapsed && <ThemeToggle />}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        chats={searchChats}
        isLoading={isLoading}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
      />
    </Sidebar>
  );
}

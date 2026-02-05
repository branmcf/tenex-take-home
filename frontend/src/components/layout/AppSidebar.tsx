"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatList, type ChatListItemData } from "@/components/chat";
import { ThemeToggle } from "@/components/theme-toggle";
import { useChatContext, useChatRefetch, useModal } from "@/contexts";
import { useChats, useAuth } from "@/hooks";

type NavItem =
  | { title: string; icon: React.ComponentType<{ className?: string }>; url: string }
  | { title: string; icon: React.ComponentType<{ className?: string }>; action: "search" | "newChat" };

const navItems: NavItem[] = [
  { title: "New chat", action: "newChat", icon: PenNib },
  { title: "Search chats", action: "search", icon: MagnifyingGlass },
  { title: "Workflows", url: "/workflows", icon: GitBranch },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { openModal, closeModal } = useModal();
  const isCollapsed = state === "collapsed";
  const { startNewChat, currentChatId } = useChatContext();
  const pathname = usePathname();
  const { user } = useAuth();
  const { registerRefetch } = useChatRefetch();

  // Fetch user chats (start with 30 for sidebar)
  const { chats, isLoading, deleteChat, hasMore, fetchMore, refetch } = useChats({
    userId: user?.id || "",
    limit: 30,
    enabled: !!user?.id,
  });

  // Register the refetch function so other components can trigger it
  React.useEffect(() => {
    registerRefetch(refetch);
    // Only register once, not on every refetch change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerRefetch]);

  // Ref for the scrollable content area
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-fetch more chats when scrolling near bottom
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // When scrolled 80% down and there are more chats to fetch
      if (scrollPercentage > 0.8 && hasMore && !isLoading) {
        // Fetch 20 more chats each time
        fetchMore(chats.length + 20);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, chats.length, fetchMore]);

  const handleDeleteChat = React.useCallback(async (chatId: string) => {
    await deleteChat(chatId);
    // If we deleted the currently active chat, navigate to home
    if (chatId === currentChatId) {
      startNewChat();
    }
  }, [deleteChat, currentChatId, startNewChat]);

  // When collapsed, only show the toggle icon
  if (isCollapsed) {
    return (
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="pb-0">
          <div className="flex items-center justify-center px-2 py-1">
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
          </div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* Fixed Header - Logo and Navigation */}
      <SidebarHeader className="pb-0">
        <div className="flex items-center justify-between px-2 py-1">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Stack className="size-4" weight="bold" />
            </div>
            HardWire
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
        </div>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {"action" in item ? (
                <SidebarMenuButton
                  onClick={() => {
                    if (item.action === "search") {
                      openModal("search");
                    } else if (item.action === "newChat") {
                      closeModal();
                      startNewChat();
                    }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild isActive={pathname === item.url}>
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
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <ChatList
              chats={chats}
              activeChatId={currentChatId ?? undefined}
              isLoading={isLoading}
              onDeleteChat={handleDeleteChat}
              grouped={false}
            />
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* Fixed Footer - Account */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-1 w-full">
              <SidebarMenuButton onClick={() => openModal("settings")} className="flex-1 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    BM
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">Brandon McFarland</span>
                  </div>
                </div>
              </SidebarMenuButton>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatContainer } from "@/components/chat";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarSimple } from "@phosphor-icons/react";
import { ChatProvider } from "@/contexts";
import {
  MOCK_MODELS,
  MOCK_WORKFLOWS,
  MOCK_RESPONSES,
  MOCK_SOURCES,
  MOCK_CHAT_CONVERSATIONS,
} from "@/lib/mocks/chat";

function ChatContent() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarInset className="flex-1 min-h-0 overflow-hidden">
      {isCollapsed && (
        <div className="absolute left-4 top-4 z-20">
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
      )}
      <ChatContainer className="flex-1 min-h-0" />
    </SidebarInset>
  );
}

interface ChatPageLayoutProps {
  initialChatId?: string;
}

export function ChatPageLayout({ initialChatId }: ChatPageLayoutProps) {
  return (
    <ChatProvider
      models={MOCK_MODELS}
      workflows={MOCK_WORKFLOWS}
      mockResponses={MOCK_RESPONSES}
      mockSources={MOCK_SOURCES}
      mockConversations={MOCK_CHAT_CONVERSATIONS}
      initialChatId={initialChatId}
    >
      <SidebarProvider className="h-svh">
        <AppSidebar />
        <ChatContent />
      </SidebarProvider>
    </ChatProvider>
  );
}

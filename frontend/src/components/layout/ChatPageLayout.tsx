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
import { ChatProvider, ModalProvider, useModal } from "@/contexts";
import { useModels, useWorkflows, useAuth } from "@/hooks";
import { ModalContainer } from "@/components/layout/ModalContainer";

function ChatContent() {
  const { state, toggleSidebar } = useSidebar();
  const { contentRef } = useModal();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarInset ref={contentRef} className="relative flex-1 min-h-0 overflow-hidden">
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
      <ModalContainer />
    </SidebarInset>
  );
}

interface ChatPageLayoutProps {
  initialChatId?: string;
}

export function ChatPageLayout({ initialChatId }: ChatPageLayoutProps) {
  const { models } = useModels();
  const { user } = useAuth();
  const { workflows } = useWorkflows({
    userId: user?.id || "",
    enabled: !!user?.id,
  });

  return (
    <ChatProvider
      models={models}
      workflows={workflows}
      initialChatId={initialChatId}
    >
      <ModalProvider>
        <SidebarProvider className="h-svh">
          <AppSidebar />
          <ChatContent />
        </SidebarProvider>
      </ModalProvider>
    </ChatProvider>
  );
}

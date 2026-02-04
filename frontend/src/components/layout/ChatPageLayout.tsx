"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatContainer } from "@/components/chat";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChatProvider, ModalProvider, useModal } from "@/contexts";
import { useModels, useWorkflows, useAuth } from "@/hooks";
import { ModalContainer } from "@/components/layout/ModalContainer";

function ChatContent() {
  const { contentRef } = useModal();

  return (
    <SidebarInset ref={contentRef} className="relative flex-1 min-h-0 overflow-hidden">
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

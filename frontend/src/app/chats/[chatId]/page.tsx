"use client";

import { ChatPageLayout } from "@/components/layout/ChatPageLayout";
import { use } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);
  return <ChatPageLayout initialChatId={chatId} />;
}

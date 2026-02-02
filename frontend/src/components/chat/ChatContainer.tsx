"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Loader } from "@/components/ui/loader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput, useModelSelection } from "./ChatInput";
import {
  MOCK_MODELS,
  MOCK_WORKFLOWS,
  MOCK_RESPONSES,
  MOCK_SOURCES,
} from "@/lib/mocks/chat";
import type { Message, ChatContainerProps } from "./types";

export function ChatContainer({ className }: ChatContainerProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [workflowId, setWorkflowId] = React.useState<string | undefined>();
  const { selectedModel, setSelectedModel } = useModelSelection(MOCK_MODELS);

  const isNewChat = messages.length === 0 && !isLoading;

  const sendMessage = React.useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      const responseIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
      const response = MOCK_RESPONSES[responseIndex];
      const sources = MOCK_SOURCES[responseIndex % MOCK_SOURCES.length];

      setTimeout(() => {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          createdAt: new Date(),
          sources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    },
    [isLoading]
  );

  const handleSubmit = React.useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {!isNewChat && (
        <ChatContainerRoot className="relative flex-1 min-h-0 overflow-hidden">
          <ChatContainerContent className="mx-auto w-full max-w-3xl px-4 py-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1 && !isLoading}
                />
              ))}

              {isLoading && (
                <div className="flex items-center py-2">
                  <Loader
                    variant="pulse-dot"
                    size="md"
                    className="text-muted-foreground"
                  />
                </div>
              )}
            </div>
          </ChatContainerContent>
          <ChatContainerScrollAnchor />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <ScrollButton />
          </div>
        </ChatContainerRoot>
      )}

      <div
        className={cn(
          "bg-background px-4 pb-6 transition-all duration-500 ease-out",
          isNewChat ? "flex flex-1 flex-col justify-center" : "shrink-0"
        )}
      >
        <div
          className={cn(
            "mx-auto w-full max-w-3xl transition-[transform,opacity] duration-500 ease-out",
            isNewChat
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-100"
          )}
        >
          {isNewChat && (
            <div className="mb-4 text-center text-3xl font-semibold text-foreground">
              B-plex
            </div>
          )}
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            models={MOCK_MODELS}
            workflows={MOCK_WORKFLOWS}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            selectedWorkflow={workflowId}
            onWorkflowChange={setWorkflowId}
          />
          {!isNewChat && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              B-Plex can make mistakes. Check important info.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

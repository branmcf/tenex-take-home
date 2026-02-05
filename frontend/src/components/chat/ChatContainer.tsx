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
import { ChatInput } from "./ChatInput";
import { WorkflowRunPanel } from "./WorkflowRunPanel";
import type { ChatContainerProps } from "./types";
import { useChatContext } from "@/contexts";

export function ChatContainer({ className }: ChatContainerProps) {
  const {
    messages,
    isLoading,
    input,
    setInput,
    sendMessage,
    models,
    workflows,
    selectedModel,
    setSelectedModel,
    isModelPreferenceLoaded,
    selectedWorkflow,
    setSelectedWorkflow,
    workflowRuns,
    isWorkflowRunning,
  } = useChatContext();

  const isNewChat = messages.length === 0 && !isLoading;

  const handleSubmit = React.useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {!isNewChat && (
        <ChatContainerRoot className="relative flex-1 min-h-0 overflow-hidden">
          <ChatContainerContent className="mx-auto w-full max-w-3xl px-4 py-8">
            <div className="space-y-8">
              {messages.map((message, index) => {
                const isLast = index === messages.length - 1 && !isLoading;
                const anchoredRuns = workflowRuns.filter(
                  (run) => run.anchorMessageId === message.id
                );

                return (
                  <React.Fragment key={message.id}>
                    <ChatMessage message={message} isLast={isLast} />
                    {anchoredRuns.map((run) => (
                      <WorkflowRunPanel key={run.id} run={run} />
                    ))}
                  </React.Fragment>
                );
              })}

              {workflowRuns
                .filter(
                  (run) =>
                    !messages.some(
                      (message) => message.id === run.anchorMessageId
                    )
                )
                .map((run) => (
                  <WorkflowRunPanel key={run.id} run={run} />
                ))}

              {isLoading && !isWorkflowRunning && (
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
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                HardWire
              </h1>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground font-mono">
                AI-Native Web Search with Deterministic Workflows
              </p>
            </div>
          )}
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={isWorkflowRunning}
            models={models}
            workflows={workflows}
            selectedModel={selectedModel?.id ?? models[0]?.id}
            onModelChange={(modelId) => {
              const model = models.find((m) => m.id === modelId);
              setSelectedModel(model);
            }}
            selectedWorkflow={selectedWorkflow}
            isModelLoading={!isModelPreferenceLoaded}
          />
          {!isNewChat && (
            <p className="mt-4 text-center text-xs uppercase tracking-wider text-muted-foreground font-mono">
              Verify important information
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

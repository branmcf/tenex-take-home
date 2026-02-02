"use client";

import * as React from "react";
import { ArrowUp, Stop, Copy, Check, ChatCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Loader } from "@/components/ui/loader";
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
} from "@/components/ui/message";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { MOCK_MODELS } from "@/lib/mocks/chat";
import { useWorkflowContext } from "@/contexts";

interface WorkflowChatProps {
  className?: string;
}

function WorkflowChatMessage({
  message,
  isLast,
}: {
  message: { id: string; role: "user" | "assistant"; content: string; createdAt: Date };
  isLast?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <Message className="justify-end">
        <div className="group flex flex-col items-end gap-1 max-w-[85%] sm:max-w-[75%]">
          <MessageContent className="bg-primary text-primary-foreground px-4 py-3 border border-primary">
            {message.content}
          </MessageContent>
          <MessageActions
            className={cn(
              "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              "mr-1"
            )}
          >
            <MessageAction tooltip={copied ? "Copied!" : "Copy"}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </MessageAction>
          </MessageActions>
        </div>
      </Message>
    );
  }

  return (
    <Message className="justify-start">
      <div className="group flex w-full flex-col gap-2">
        <MessageContent
          className="prose prose-sm dark:prose-invert max-w-none"
          markdown
        >
          {message.content}
        </MessageContent>
        <MessageActions
          className={cn(
            "-ml-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
            isLast && "opacity-100"
          )}
        >
          <MessageAction tooltip={copied ? "Copied!" : "Copy"}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  );
}

export function WorkflowChat({ className }: WorkflowChatProps) {
  const {
    workflowChatMessages,
    workflowChatInput,
    setWorkflowChatInput,
    sendWorkflowChatMessage,
    isWorkflowChatLoading,
    selectedWorkflow,
  } = useWorkflowContext();

  const [selectedModel, setSelectedModel] = React.useState(MOCK_MODELS[0].id);

  const canSubmit = workflowChatInput.trim().length > 0 && !isWorkflowChatLoading && selectedWorkflow !== null;

  const handleSubmit = React.useCallback(() => {
    sendWorkflowChatMessage(workflowChatInput);
  }, [workflowChatInput, sendWorkflowChatMessage]);

  // Empty state when no workflow is selected
  if (!selectedWorkflow) {
    return (
      <div className={cn("flex h-full min-h-0 flex-col items-center justify-center", className)}>
        <ChatCircle className="h-16 w-16 text-muted-foreground/30 mb-4" weight="thin" />
        <h2 className="text-lg font-medium text-foreground mb-1">No Workflow Selected</h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Select a workflow from the list to view and edit its configuration, or create a new one.
        </p>
      </div>
    );
  }

  // When a workflow is selected, always show the chat interface with messages at the top
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <ChatContainerRoot className="relative flex-1 min-h-0 overflow-hidden">
        <ChatContainerContent className="mx-auto w-full max-w-2xl px-4 py-8">
          <div className="space-y-8">
            {workflowChatMessages.map((message, index) => (
              <WorkflowChatMessage
                key={message.id}
                message={message}
                isLast={index === workflowChatMessages.length - 1 && !isWorkflowChatLoading}
              />
            ))}

            {isWorkflowChatLoading && (
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

      <div className="bg-background px-4 pb-6 shrink-0">
        <div className="mx-auto w-full max-w-2xl">
          <PromptInput
            value={workflowChatInput}
            onValueChange={setWorkflowChatInput}
            onSubmit={handleSubmit}
            isLoading={isWorkflowChatLoading}
            className="border border-border bg-background"
          >
            <PromptInputTextarea
              placeholder="Describe how you want to modify this workflow..."
              className="min-h-[48px] py-3 px-4 text-base"
            />
            <PromptInputActions className="flex items-center justify-between gap-2 px-3 pb-3">
              <div className="flex items-center gap-2">
                <ModelSelector
                  models={MOCK_MODELS}
                  value={selectedModel}
                  onChange={setSelectedModel}
                  disabled={isWorkflowChatLoading}
                />
                {/* No WorkflowSelector here - that's the key difference */}
              </div>
              <PromptInputAction tooltip={isWorkflowChatLoading ? "Stop" : "Send message"}>
                <Button
                  size="icon"
                  disabled={!canSubmit && !isWorkflowChatLoading}
                  onClick={isWorkflowChatLoading ? undefined : handleSubmit}
                  className="h-9 w-9"
                >
                  {isWorkflowChatLoading ? (
                    <Stop className="h-4 w-4" weight="fill" />
                  ) : (
                    <ArrowUp className="h-4 w-4" weight="bold" />
                  )}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
          <p className="mt-4 text-center text-xs uppercase tracking-wider text-muted-foreground font-mono">
            Changes will create a new workflow version
          </p>
        </div>
      </div>
    </div>
  );
}

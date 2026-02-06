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
import { useWorkflowContext, useChatContext } from "@/contexts";

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
          <MessageContent className="chat-user-text bg-primary text-primary-foreground px-4 py-3 border border-primary">
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
          className="max-w-none"
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

function ProposedChangesPanel({
  proposal,
  onApply,
  onReject,
  isApplying,
  isActionable,
  stepLookup,
}: {
  proposal: {
    proposalId: string;
    toolCalls: unknown;
    previewSteps: Array<{ id: string; name: string }>;
    status: "pending" | "applied" | "rejected" | "expired";
  };
  onApply: () => void;
  onReject: () => void;
  isApplying: boolean;
  isActionable: boolean;
  stepLookup: Record<string, string>;
}) {
  type ToolCall = {
    name?: string;
    toolName?: string;
    args?: Record<string, unknown>;
    input?: Record<string, unknown>;
  };

  const toolCalls = Array.isArray(proposal.toolCalls)
    ? (proposal.toolCalls as ToolCall[])
    : [];
  const isPending = proposal.status === "pending";
  const showActions = isPending && isActionable;
  const statusLabelMap: Record<typeof proposal.status, string> = {
    pending: "Pending",
    applied: "Accepted",
    rejected: "Rejected",
    expired: "Expired",
  };
  const statusToneMap: Record<typeof proposal.status, string> = {
    pending: "border-orange-200 bg-orange-50 text-orange-700",
    applied: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    expired: "border-slate-200 bg-slate-50 text-slate-600",
  };

  const resolveStepName = (stepId?: string) => {
    if (!stepId) {
      return "unknown";
    }
    return stepLookup[stepId] ?? stepId;
  };

  const renderToolCall = (call: ToolCall) => {
    const name = call?.name ?? call?.toolName ?? "unknown";
    const args = call?.args ?? call?.input ?? {};
    const stepId = typeof args.stepId === "string" ? args.stepId : undefined;

    if (name === "add_step") {
      return `Add step: ${args.name ?? "Untitled Step"}`;
    }
    if (name === "update_step") {
      return `Update step: ${resolveStepName(stepId)}`;
    }
    if (name === "delete_step") {
      return `Delete step: ${resolveStepName(stepId)}`;
    }
    if (name === "reorder_steps") {
      return `Reorder step: ${resolveStepName(stepId)}`;
    }
    return `Change: ${name}`;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Proposed Changes</h3>
            <span
              className={cn(
                "inline-flex items-center border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-none",
                statusToneMap[proposal.status]
              )}
            >
              {statusLabelMap[proposal.status]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {proposal.previewSteps.length} step{proposal.previewSteps.length !== 1 ? "s" : ""} in preview
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showActions && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReject}
                disabled={isApplying}
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={onApply}
                disabled={isApplying}
              >
                {isApplying ? "Applying..." : "Apply Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {toolCalls.length > 0 && (
        <div className="space-y-2">
          {toolCalls.map((call, index) => (
            <div
              key={`${proposal.proposalId}-${index}`}
              className="text-xs text-muted-foreground"
            >
              - {renderToolCall(call)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WorkflowChat({ className }: WorkflowChatProps) {
  const {
    workflowChatMessages,
    workflowChatProposals,
    workflowChatInput,
    setWorkflowChatInput,
    sendWorkflowChatMessage,
    isWorkflowChatLoading,
    selectedWorkflow,
    pendingProposal,
    applyWorkflowProposal,
    rejectWorkflowProposal,
    isApplyingProposal,
  } = useWorkflowContext();
  const { models, preferredModelId, savePreferredModel, isModelPreferenceLoaded } = useChatContext();

  const [selectedModel, setSelectedModel] = React.useState(
    preferredModelId ?? ""
  );

  const proposalStepLookup = React.useMemo(() => {
    const lookup: Record<string, string> = {};

    if (selectedWorkflow?.steps) {
      selectedWorkflow.steps.forEach((step) => {
        lookup[step.id] = step.name;
      });
    }

    workflowChatProposals.forEach((proposal) => {
      proposal.previewSteps.forEach((step) => {
        lookup[step.id] = step.name;
      });
    });

    if (pendingProposal && !workflowChatProposals.some((proposal) => proposal.proposalId === pendingProposal.proposalId)) {
      pendingProposal.previewSteps.forEach((step) => {
        lookup[step.id] = step.name;
      });
    }

    return lookup;
  }, [workflowChatProposals, selectedWorkflow?.steps, pendingProposal]);

  const proposalsForDisplay = React.useMemo(() => {
    if (!pendingProposal) {
      return workflowChatProposals;
    }

    const exists = workflowChatProposals.some(
      (proposal) => proposal.proposalId === pendingProposal.proposalId
    );

    if (exists) {
      return workflowChatProposals;
    }

    return [...workflowChatProposals, pendingProposal];
  }, [workflowChatProposals, pendingProposal]);

  const chatItems = React.useMemo(() => {
    const orderedMessages = [...workflowChatMessages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
    const orderedProposals = [...proposalsForDisplay].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    const items: Array<
      | { type: "message"; message: typeof orderedMessages[number] }
      | { type: "proposal"; proposal: typeof orderedProposals[number] }
    > = orderedMessages.map((message) => ({
      type: "message",
      message,
    }));

    orderedProposals.forEach((proposal) => {
      const anchorMessage = orderedMessages.find(
        (message) =>
          message.role === "assistant" &&
          message.createdAt.getTime() >= proposal.createdAt.getTime()
      );

      if (!anchorMessage) {
        items.push({ type: "proposal", proposal });
        return;
      }

      const anchorIndex = items.findIndex(
        (item) => item.type === "message" && item.message.id === anchorMessage.id
      );

      if (anchorIndex === -1) {
        items.push({ type: "proposal", proposal });
        return;
      }

      let insertIndex = anchorIndex;
      while (items[insertIndex + 1]?.type === "proposal") {
        insertIndex += 1;
      }

      items.splice(insertIndex + 1, 0, { type: "proposal", proposal });
    });

    return items;
  }, [workflowChatMessages, proposalsForDisplay]);

  const lastMessageId = React.useMemo(() => {
    if (workflowChatMessages.length === 0) {
      return null;
    }

    const orderedMessages = [...workflowChatMessages].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    return orderedMessages.length > 0
      ? orderedMessages[orderedMessages.length - 1].id
      : null;
  }, [workflowChatMessages]);

  // Set model once the preference has loaded
  React.useEffect(() => {
    if (!isModelPreferenceLoaded || models.length === 0 || selectedModel) {
      return;
    }

    const preferred = preferredModelId ?? models[0].id;
    setSelectedModel(preferred);
  }, [isModelPreferenceLoaded, models, preferredModelId, selectedModel]);

  const canSubmit = workflowChatInput.trim().length > 0
    && !isWorkflowChatLoading
    && selectedWorkflow !== null
    && selectedModel
    && isModelPreferenceLoaded;

  const handleSubmit = React.useCallback(() => {
    if (selectedModel) {
      sendWorkflowChatMessage(workflowChatInput, selectedModel);
    }
  }, [workflowChatInput, sendWorkflowChatMessage, selectedModel]);

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
            {chatItems.map((item) => {
              if (item.type === "message") {
                return (
                  <WorkflowChatMessage
                    key={item.message.id}
                    message={item.message}
                    isLast={item.message.id === lastMessageId && !isWorkflowChatLoading}
                  />
                );
              }

              const isActiveProposal = pendingProposal?.proposalId === item.proposal.proposalId;

              return (
                <ProposedChangesPanel
                  key={item.proposal.proposalId}
                  proposal={item.proposal}
                  onApply={applyWorkflowProposal}
                  onReject={rejectWorkflowProposal}
                  isApplying={isApplyingProposal && isActiveProposal}
                  isActionable={isActiveProposal}
                  stepLookup={proposalStepLookup}
                />
              );
            })}

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
              placeholder="Describe your workflow..."
              className="min-h-[48px] py-3 px-4 text-base"
            />
            <PromptInputActions className="flex items-center justify-between gap-2 px-3 pb-3">
              <div className="flex items-center gap-2">
                {isModelPreferenceLoaded ? (
                  <ModelSelector
                    models={models}
                    value={selectedModel}
                    onChange={(modelId) => {
                      setSelectedModel(modelId);
                      savePreferredModel(modelId);
                    }}
                    disabled={isWorkflowChatLoading}
                  />
                ) : (
                  <div className="flex h-8 w-[180px] items-center justify-center rounded-md border border-border bg-muted/40">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/60 border-t-transparent" />
                  </div>
                )}
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

"use client";

import * as React from "react";
import { ArrowUp, Stop } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import { ModelSelector, useModelSelection } from "./ModelSelector";
import { WorkflowSelector } from "./WorkflowSelector";
import type { Model, Workflow } from "./types";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  models: Model[];
  workflows: Workflow[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  selectedWorkflow: string | undefined;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  className,
  models,
  workflows,
  selectedModel,
  onModelChange,
  selectedWorkflow,
}: ChatInputProps) {
  const canSubmit = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className={cn("w-full", className)}>
      <PromptInput
        value={value}
        onValueChange={onChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
        disabled={disabled}
        className="border border-border bg-background"
      >
        <PromptInputTextarea
          placeholder="Ask anything..."
          className="min-h-[48px] py-3 px-4 text-base"
        />
        <PromptInputActions className="flex items-center justify-between gap-2 px-3 pb-3">
          <div className="flex items-center gap-2">
            <ModelSelector
              models={models}
              value={selectedModel}
              onChange={onModelChange}
              disabled={isLoading}
            />
            <WorkflowSelector
              workflows={workflows}
              value={selectedWorkflow}
              disabled={isLoading}
            />
          </div>
          <PromptInputAction tooltip={isLoading ? "Stop" : "Send message"}>
            <Button
              size="icon"
              disabled={!canSubmit && !isLoading}
              onClick={isLoading ? undefined : onSubmit}
              className="h-9 w-9"
            >
              {isLoading ? (
                <Stop className="h-4 w-4" weight="fill" />
              ) : (
                <ArrowUp className="h-4 w-4" weight="bold" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
}

export { useModelSelection };

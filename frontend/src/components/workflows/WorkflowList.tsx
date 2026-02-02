"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { WorkflowCard } from "./WorkflowCard";
import type { WorkflowListItemData } from "./types";

interface WorkflowListProps {
  workflows: WorkflowListItemData[];
  selectedWorkflowId: string | null;
  onSelectWorkflow: (workflowId: string) => void;
  onRenameWorkflow: (workflowId: string, newName: string) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  className?: string;
}

export function WorkflowList({
  workflows,
  selectedWorkflowId,
  onSelectWorkflow,
  onRenameWorkflow,
  onDeleteWorkflow,
  className,
}: WorkflowListProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No workflows yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Use the chat to create your first workflow
          </p>
        </div>
      ) : (
        workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            isSelected={workflow.id === selectedWorkflowId}
            onSelect={onSelectWorkflow}
            onRename={onRenameWorkflow}
            onDelete={onDeleteWorkflow}
          />
        ))
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { TreeStructure, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "./WorkflowCard";
import type { WorkflowListItemData } from "./types";

interface WorkflowListProps {
  workflows: WorkflowListItemData[];
  selectedWorkflowId: string | null;
  onSelectWorkflow: (workflowId: string) => void;
  onRenameWorkflow: (workflowId: string, newName: string) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  onCreateWorkflow?: () => void;
  className?: string;
}

export function WorkflowList({
  workflows,
  selectedWorkflowId,
  onSelectWorkflow,
  onRenameWorkflow,
  onDeleteWorkflow,
  onCreateWorkflow,
  className,
}: WorkflowListProps) {
  if (workflows.length === 0) {
    return (
      <div className={cn("flex h-full flex-col items-center justify-center text-center px-4", className)}>
        <TreeStructure className="h-16 w-16 text-muted-foreground/30 mb-4" weight="thin" />
        <h2 className="text-lg font-medium text-foreground mb-4">No Workflows Created</h2>
        {onCreateWorkflow && (
          <Button
            onClick={onCreateWorkflow}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Workflow
            <Plus className="h-4 w-4 ml-1" weight="bold" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          isSelected={workflow.id === selectedWorkflowId}
          onSelect={onSelectWorkflow}
          onRename={onRenameWorkflow}
          onDelete={onDeleteWorkflow}
        />
      ))}
    </div>
  );
}

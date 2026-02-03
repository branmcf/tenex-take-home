"use client";

import * as React from "react";
import { GitBranch, CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useModal } from "@/contexts";
import type { Workflow } from "./types";

interface WorkflowSelectorProps {
  workflows: Workflow[];
  value: string | undefined;
  disabled?: boolean;
  className?: string;
}

export function WorkflowSelector({
  workflows,
  value,
  disabled,
  className,
}: WorkflowSelectorProps) {
  const { openModal } = useModal();

  const selectedWorkflow = workflows.find((w) => w.id === value);
  const displayText = selectedWorkflow?.name || "Workflow";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => openModal("workflow")}
      className={cn(
        "h-8 gap-1.5 px-2.5 text-xs font-normal",
        !selectedWorkflow && "text-muted-foreground",
        className
      )}
    >
      <GitBranch className="h-3.5 w-3.5" />
      <span className="max-w-[100px] truncate">{displayText}</span>
      <CaretDown className="h-3 w-3 opacity-50" />
    </Button>
  );
}

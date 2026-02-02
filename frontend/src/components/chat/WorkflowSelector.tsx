"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Workflow } from "./types";

const NONE_VALUE = "__none__";

interface WorkflowSelectorProps {
  workflows: Workflow[];
  value: string | undefined;
  onChange: (workflowId: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function WorkflowSelector({
  workflows,
  value,
  onChange,
  disabled,
  className,
}: WorkflowSelectorProps) {
  const handleChange = (newValue: string) => {
    onChange(newValue === NONE_VALUE ? undefined : newValue);
  };

  return (
    <Select
      value={value || NONE_VALUE}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-[140px] h-8 text-xs", className)}>
        <SelectValue placeholder="Workflow" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE_VALUE} className="text-xs">
          <span className="text-muted-foreground">No workflow</span>
        </SelectItem>
        {workflows.map((workflow) => (
          <SelectItem key={workflow.id} value={workflow.id} className="text-xs">
            {workflow.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

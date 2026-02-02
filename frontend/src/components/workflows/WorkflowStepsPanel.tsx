"use client";

import * as React from "react";
import { CaretDown, CaretRight, Wrench, ListNumbers } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { WorkflowStep, WorkflowDetail } from "./types";

interface WorkflowStepItemProps {
  step: WorkflowStep;
  stepNumber: number;
  defaultOpen?: boolean;
}

function WorkflowStepItem({ step, stepNumber, defaultOpen = false }: WorkflowStepItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-medium">
            {stepNumber}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{step.name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {step.tools.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wrench className="h-3 w-3" />
                {step.tools.length}
              </span>
            )}
            {isOpen ? (
              <CaretDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <CaretRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border p-3 space-y-4 bg-muted/30">
            {/* Prompt Section */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Prompt
              </h4>
              <div className="rounded-md bg-background border border-border p-3">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {step.prompt}
                </p>
              </div>
            </div>

            {/* Tools Section */}
            {step.tools.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {step.tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="inline-flex items-center gap-1.5 rounded-md bg-background border border-border px-2.5 py-1.5"
                    >
                      <Wrench className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface WorkflowStepsPanelProps {
  workflow: WorkflowDetail | null;
  className?: string;
}

export function WorkflowStepsPanel({ workflow, className }: WorkflowStepsPanelProps) {
  if (!workflow) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 text-center px-4", className)}>
        <ListNumbers className="h-16 w-16 text-muted-foreground/30 mb-4" weight="thin" />
        <h2 className="text-lg font-medium text-foreground mb-1">No Workflow Selected</h2>
        <p className="text-sm text-muted-foreground">
          Select a workflow to view its execution steps and configuration.
        </p>
      </div>
    );
  }

  const sortedSteps = [...workflow.steps].sort((a, b) => a.order - b.order);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold truncate">{workflow.name}</h2>
          <p className="text-xs text-muted-foreground">
            {workflow.steps.length} step{workflow.steps.length !== 1 ? "s" : ""} • v{workflow.version}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedSteps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No steps defined
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use the chat to add steps to this workflow
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Visual DAG connection lines */}
            {sortedSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection line to next step */}
                {index < sortedSteps.length - 1 && (
                  <div className="absolute left-[22px] top-full w-0.5 h-3 bg-border z-0" />
                )}
                <WorkflowStepItem
                  step={step}
                  stepNumber={index + 1}
                  defaultOpen={index === 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

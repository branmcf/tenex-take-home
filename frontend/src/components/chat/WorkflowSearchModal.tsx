"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, GitBranch, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks";
import type { Workflow } from "./types";

export interface WorkflowSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflows: Workflow[];
  selectedWorkflowId: string | undefined;
  onSelect: (workflowId: string | undefined) => void;
  isLoading?: boolean;
}

function SearchSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="h-5 w-5 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query, onCreateClick }: { query: string; onCreateClick: () => void }) {
  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <GitBranch className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No workflows yet</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Create a workflow to automate your tasks
        </p>
        <Button
          onClick={onCreateClick}
          className="mt-4 bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create a workflow
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <p className="text-sm text-muted-foreground">No results found</p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        No workflows matching &quot;{query}&quot;
      </p>
    </div>
  );
}

export function WorkflowSearchModal({
  isOpen,
  onClose,
  workflows,
  selectedWorkflowId,
  onSelect,
  isLoading = false,
}: WorkflowSearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isSearching, setIsSearching] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Filter workflows based on debounced query
  const filteredWorkflows = React.useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (!query) {
      return workflows;
    }
    return workflows.filter((workflow) =>
      workflow.name.toLowerCase().includes(query)
    );
  }, [workflows, debouncedQuery]);

  // Handle loading state when query changes
  React.useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery, debouncedQuery]);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle keyboard navigation
  // Index 0 = "No workflow", Index 1+ = workflows
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const totalItems = filteredWorkflows.length + 1; // +1 for "No workflow"

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex === -1) return;

        if (selectedIndex === 0) {
          // "No workflow" is selected
          onSelect(undefined);
          onClose();
        } else {
          // Workflow item is selected
          const selectedWorkflow = filteredWorkflows[selectedIndex - 1];
          if (selectedWorkflow) {
            onSelect(selectedWorkflow.id);
            onClose();
          }
        }
        break;
    }
  };

  // Scroll selected item into view
  React.useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleWorkflowClick = (workflowId: string | undefined) => {
    onSelect(workflowId);
    onClose();
  };

  const handleCreateWorkflow = () => {
    onClose();
    router.push("/workflows");
  };

  if (!isOpen) return null;

  const showLoading = isLoading || isSearching;
  const showEmpty = !showLoading && workflows.length === 0;
  const showNoResults = !showLoading && !showEmpty && filteredWorkflows.length === 0 && searchQuery.trim().length > 0;
  const showResults = !showLoading && !showEmpty && filteredWorkflows.length > 0;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]"
        style={{ height: "min(400px, 60vh)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Select workflow"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search workflows..."
            className="h-10 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Results Area */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto">
          {/* Loading State */}
          {showLoading && <SearchSkeleton />}

          {/* Empty State - No workflows exist */}
          {showEmpty && <EmptyState query="" onCreateClick={handleCreateWorkflow} />}

          {/* No Results State - Workflows exist but none match search */}
          {showNoResults && <EmptyState query={debouncedQuery} onCreateClick={handleCreateWorkflow} />}

          {/* Results */}
          {showResults && (
            <div className="p-2">
              {/* No workflow option */}
              <button
                type="button"
                onClick={() => handleWorkflowClick(undefined)}
                data-index={0}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
                  "hover:bg-accent",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  selectedIndex === 0 && "bg-accent",
                  selectedWorkflowId === undefined && "text-primary"
                )}
              >
                <div className="flex h-5 w-5 items-center justify-center">
                  <X className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className={cn(
                  "font-medium",
                  selectedWorkflowId === undefined && "text-primary"
                )}>
                  No workflow
                </span>
                {selectedWorkflowId === undefined && (
                  <span className="ml-auto text-xs text-muted-foreground">Selected</span>
                )}
              </button>

              {/* Workflow items */}
              {filteredWorkflows.map((workflow, index) => {
                const itemIndex = index + 1; // +1 because index 0 is "No workflow"
                const isCurrentlySelected = selectedWorkflowId === workflow.id;

                return (
                  <button
                    key={workflow.id}
                    type="button"
                    onClick={() => handleWorkflowClick(workflow.id)}
                    data-index={itemIndex}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none transition-colors",
                      "hover:bg-accent",
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      selectedIndex === itemIndex && "bg-accent",
                      isCurrentlySelected && "text-primary"
                    )}
                  >
                    <GitBranch className="h-5 w-5 text-muted-foreground" />
                    <span className={cn(
                      "truncate font-medium",
                      isCurrentlySelected && "text-primary"
                    )}>
                      {workflow.name}
                    </span>
                    {isCurrentlySelected && (
                      <span className="ml-auto text-xs text-muted-foreground">Selected</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

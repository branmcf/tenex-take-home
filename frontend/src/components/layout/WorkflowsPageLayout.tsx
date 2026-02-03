"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { WorkflowList, WorkflowStepsPanel, WorkflowChat } from "@/components/workflows";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarSimple, Plus } from "@phosphor-icons/react";
import { ChatProvider, WorkflowProvider, useWorkflowContext, ModalProvider, useModal } from "@/contexts";
import { ModalContainer } from "@/components/layout/ModalContainer";
import { useModels, useWorkflows, useAuth } from "@/hooks";
import type { WorkflowDetail } from "@/components/workflows/types";
import type { Workflow } from "@/lib/api";

function WorkflowsContent() {
  const { state, toggleSidebar } = useSidebar();
  const { contentRef } = useModal();
  const isCollapsed = state === "collapsed";

  const {
    workflows,
    selectedWorkflow,
    setSelectedWorkflow,
    renameWorkflow,
    deleteWorkflow,
    createWorkflow,
  } = useWorkflowContext();

  const handleSelectWorkflow = React.useCallback(
    (workflowId: string) => {
      const workflow = workflows.find((w) => w.id === workflowId);
      if (workflow) {
        setSelectedWorkflow(workflow);
      }
    },
    [workflows, setSelectedWorkflow]
  );

  // Convert WorkflowDetail to WorkflowListItemData
  const workflowListItems = React.useMemo(
    () =>
      workflows.map((w) => ({
        id: w.id,
        name: w.name,
        description: w.description,
        version: w.version,
        lastEditedAt: w.lastEditedAt,
      })),
    [workflows]
  );

  return (
    <SidebarInset ref={contentRef} className="relative flex-1 min-h-0 overflow-hidden">
      {isCollapsed && (
        <div className="absolute left-4 top-4 z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleSidebar}
              >
                <SidebarSimple className="size-4" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Open sidebar</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Three-column layout */}
      <div className="flex h-full">
        {/* Left Column - Workflow List */}
        <div className="w-72 shrink-0 border-r border-border flex flex-col overflow-hidden bg-background">
          {workflows.length > 0 && (
            <div className="px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold whitespace-nowrap">My Workflows</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {workflows.length} workflow{workflows.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button
                  onClick={createWorkflow}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                >
                  Create
                  <Plus className="h-4 w-4 ml-1" weight="bold" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-3">
            <WorkflowList
              workflows={workflowListItems}
              selectedWorkflowId={selectedWorkflow?.id ?? null}
              onSelectWorkflow={handleSelectWorkflow}
              onRenameWorkflow={renameWorkflow}
              onDeleteWorkflow={deleteWorkflow}
              onCreateWorkflow={createWorkflow}
            />
          </div>
        </div>

        {/* Middle Column - Chat */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden border-r border-border">
          <WorkflowChat className="flex-1 min-h-0" />
        </div>

        {/* Right Column - Workflow Steps */}
        <div className="w-80 shrink-0 flex flex-col overflow-hidden bg-muted/20">
          <WorkflowStepsPanel
            workflow={selectedWorkflow}
            className="flex-1 min-h-0"
          />
        </div>
      </div>
      <ModalContainer />
    </SidebarInset>
  );
}

interface WorkflowsPageLayoutProps {
  initialWorkflowId?: string;
}

export function WorkflowsPageLayout({ initialWorkflowId }: WorkflowsPageLayoutProps) {
  const { models } = useModels();
  const { user } = useAuth();
  const { workflows: apiWorkflows } = useWorkflows({
    userId: user?.id || "",
    enabled: !!user?.id,
  });

  // Transform API workflows to WorkflowDetail format
  const workflowDetails: WorkflowDetail[] = React.useMemo(() => {
    return apiWorkflows.map((workflow: Workflow) => ({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description ?? "",
      version: workflow.version ?? 1,
      steps: [], // Steps will be loaded when workflow is selected
      lastEditedAt: new Date(workflow.updatedAt),
      createdAt: new Date(workflow.updatedAt), // Use updatedAt as createdAt since API doesn't provide it
    }));
  }, [apiWorkflows]);

  return (
    <ChatProvider models={models} workflows={apiWorkflows}>
      <WorkflowProvider initialWorkflows={workflowDetails} initialWorkflowId={initialWorkflowId}>
        <ModalProvider>
          <SidebarProvider className="h-svh">
            <AppSidebar />
            <WorkflowsContent />
          </SidebarProvider>
        </ModalProvider>
      </WorkflowProvider>
    </ChatProvider>
  );
}

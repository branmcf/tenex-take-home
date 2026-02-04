"use client";

import * as React from "react";
import type { WorkflowDetail } from "@/components/workflows/types";
import {
  createWorkflow as createWorkflowApi,
  updateWorkflow as updateWorkflowApi,
  deleteWorkflow as deleteWorkflowApi,
  getWorkflowById as getWorkflowByIdApi,
  getWorkflowChatMessages,
  sendWorkflowChatMessage as sendWorkflowChatMessageApi,
  applyWorkflowChatProposal as applyWorkflowChatProposalApi,
} from "@/lib/api";
import { useAuth } from "@/hooks";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface WorkflowChatProposal {
  proposalId: string;
  baseVersionId: string | null;
  toolCalls: unknown;
  previewSteps: Array<{
    id: string;
    name: string;
    instruction: string;
    tools?: Array<{ id: string; name?: string; version?: string }>;
    dependsOn?: string[];
  }>;
}

interface WorkflowContextValue {
  // Workflow list state
  workflows: WorkflowDetail[];
  isLoading: boolean;

  // Selected workflow
  selectedWorkflow: WorkflowDetail | null;
  setSelectedWorkflow: (workflow: WorkflowDetail | null) => void;
  selectWorkflowById: (workflowId: string) => void;

  // Workflow actions
  deleteWorkflow: (workflowId: string) => void;
  renameWorkflow: (workflowId: string, newName: string) => void;
  createWorkflow: () => void;

  // Chat state for workflow authoring
  workflowChatMessages: ChatMessage[];
  workflowChatInput: string;
  setWorkflowChatInput: (value: string) => void;
  sendWorkflowChatMessage: (content: string, modelId: string) => void;
  isWorkflowChatLoading: boolean;
  pendingProposal: WorkflowChatProposal | null;
  applyWorkflowProposal: () => void;
  rejectWorkflowProposal: () => void;
  isApplyingProposal: boolean;
}

const WorkflowContext = React.createContext<WorkflowContextValue | null>(null);

export function useWorkflowContext() {
  const context = React.useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflowContext must be used within a WorkflowProvider");
  }
  return context;
}

interface WorkflowProviderProps {
  children: React.ReactNode;
  initialWorkflows: WorkflowDetail[];
  initialWorkflowId?: string;
}

// Prefix for draft workflow IDs (not yet persisted to DB)
const DRAFT_ID_PREFIX = "draft-";

export function WorkflowProvider({
  children,
  initialWorkflows,
  initialWorkflowId,
}: WorkflowProviderProps) {
  const { user } = useAuth();
  const [workflows, setWorkflows] = React.useState<WorkflowDetail[]>(initialWorkflows);
  const [isLoading, setIsLoading] = React.useState(false);
  // Start with no workflow selected, or load from URL if provided
  const [selectedWorkflow, setSelectedWorkflowState] = React.useState<WorkflowDetail | null>(() => {
    if (initialWorkflowId) {
      return initialWorkflows.find((w) => w.id === initialWorkflowId) ?? null;
    }
    return null;
  });

  // Chat state for workflow authoring
  const [workflowChatMessages, setWorkflowChatMessages] = React.useState<ChatMessage[]>([]);
  const [workflowChatInput, setWorkflowChatInput] = React.useState("");
  const [isWorkflowChatLoading, setIsWorkflowChatLoading] = React.useState(false);
  const [pendingProposal, setPendingProposal] = React.useState<WorkflowChatProposal | null>(null);
  const [isApplyingProposal, setIsApplyingProposal] = React.useState(false);
  const activeWorkflowIdRef = React.useRef<string | null>(selectedWorkflow?.id ?? null);

  // Sync workflows state when initialWorkflows prop changes (fixes async data loading)
  React.useEffect(() => {
    // Merge: keep any local draft workflows, update with fresh data from API
    setWorkflows((prev) => {
      const draftWorkflows = prev.filter((w) => w.id.startsWith(DRAFT_ID_PREFIX));
      // Combine drafts with API workflows, drafts first
      return [...draftWorkflows, ...initialWorkflows];
    });
  }, [initialWorkflows]);

  // Load chat messages when a workflow is selected
  const loadWorkflowChatMessages = React.useCallback(async (workflowId: string, workflowName: string, stepCount: number) => {
    try {
      const messages = await getWorkflowChatMessages(workflowId);
      if (activeWorkflowIdRef.current !== workflowId) {
        return;
      }
      if (messages.length > 0) {
        // Convert API messages to ChatMessage format
        setWorkflowChatMessages(
          messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: new Date(msg.createdAt),
          }))
        );
      } else {
        // If no messages exist, show a welcome message
        setWorkflowChatMessages([
          {
            id: `init-${workflowId}`,
            role: "assistant" as const,
            content: `This is the **${workflowName}** workflow. It currently has ${stepCount} step${stepCount !== 1 ? 's' : ''}.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
            createdAt: new Date(),
          },
        ]);
      }
    } catch (error) {
      // On error, show welcome message
      console.error("Failed to load workflow chat messages:", error);
      if (activeWorkflowIdRef.current !== workflowId) {
        return;
      }
      setWorkflowChatMessages([
        {
          id: `init-${workflowId}`,
          role: "assistant" as const,
          content: `This is the **${workflowName}** workflow. It currently has ${stepCount} step${stepCount !== 1 ? 's' : ''}.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
          createdAt: new Date(),
        },
      ]);
    }
  }, []);

  // Load chat messages when initial workflow is provided
  React.useEffect(() => {
    if (initialWorkflowId && selectedWorkflow) {
      loadWorkflowChatMessages(selectedWorkflow.id, selectedWorkflow.name, selectedWorkflow.steps.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load workflow details when workflow changes
  const setSelectedWorkflow = React.useCallback(async (workflow: WorkflowDetail | null) => {
    // Handle deselection case
    if (!workflow) {
      activeWorkflowIdRef.current = null;
      setSelectedWorkflowState(null);
      setPendingProposal(null);
      setWorkflowChatMessages([]);
      // Update URL without triggering Next.js navigation (avoids remount)
      window.history.pushState(null, "", "/workflows");
      return;
    }

    // Set the active workflow ref immediately to track stale requests
    activeWorkflowIdRef.current = workflow.id;
    setPendingProposal(null);

    // Update URL without triggering Next.js navigation (avoids remount)
    window.history.pushState(null, "", `/workflows/${workflow.id}`);

    // Load all data first, then batch state updates together
    try {
      let fullWorkflowDetail = workflow;

      // Load full workflow details if steps are empty
      if (workflow.steps.length === 0) {
        const fullWorkflow = await getWorkflowByIdApi(workflow.id);
        if (activeWorkflowIdRef.current !== workflow.id) {
          return; // Stale request - user selected a different workflow
        }

        fullWorkflowDetail = {
          id: fullWorkflow.id,
          name: fullWorkflow.name,
          description: fullWorkflow.description ?? "",
          version: fullWorkflow.version ?? 1,
          steps: fullWorkflow.steps.map((step) => ({
            id: step.id,
            name: step.name,
            prompt: step.prompt,
            tools: step.tools,
            order: step.order,
          })),
          lastEditedAt: new Date(fullWorkflow.updatedAt),
          createdAt: new Date(fullWorkflow.createdAt),
        };
      }

      // Load chat messages
      let chatMessages: ChatMessage[] = [];
      try {
        const messages = await getWorkflowChatMessages(workflow.id);
        if (activeWorkflowIdRef.current !== workflow.id) {
          return; // Stale request
        }

        if (messages.length > 0) {
          chatMessages = messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: new Date(msg.createdAt),
          }));
        } else {
          // Create welcome message
          chatMessages = [
            {
              id: `init-${workflow.id}`,
              role: "assistant" as const,
              content: `This is the **${fullWorkflowDetail.name}** workflow. It currently has ${fullWorkflowDetail.steps.length} step${fullWorkflowDetail.steps.length !== 1 ? 's' : ''}.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
              createdAt: new Date(),
            },
          ];
        }
      } catch (error) {
        console.error("Failed to load workflow chat messages:", error);
        if (activeWorkflowIdRef.current !== workflow.id) {
          return; // Stale request
        }
        // Create welcome message as fallback
        chatMessages = [
          {
            id: `init-${workflow.id}`,
            role: "assistant" as const,
            content: `This is the **${fullWorkflowDetail.name}** workflow. It currently has ${fullWorkflowDetail.steps.length} step${fullWorkflowDetail.steps.length !== 1 ? 's' : ''}.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
            createdAt: new Date(),
          },
        ];
      }

      // Batch all state updates together to minimize re-renders
      setSelectedWorkflowState(fullWorkflowDetail);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === workflow.id ? fullWorkflowDetail : w))
      );
      setWorkflowChatMessages(chatMessages);
    } catch (error) {
      console.error("Failed to load workflow details:", error);
      if (activeWorkflowIdRef.current !== workflow.id) {
        return; // Stale request
      }
      // Fallback: show the basic workflow with welcome message
      setSelectedWorkflowState(workflow);
      setWorkflowChatMessages([
        {
          id: `init-${workflow.id}`,
          role: "assistant" as const,
          content: `This is the **${workflow.name}** workflow. It currently has ${workflow.steps.length} step${workflow.steps.length !== 1 ? 's' : ''}.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
          createdAt: new Date(),
        },
      ]);
    }
  }, []);

  const selectWorkflowById = React.useCallback((workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow) {
      setSelectedWorkflow(workflow);
    }
  }, [workflows, setSelectedWorkflow]);

  const deleteWorkflowHandler = React.useCallback(async (workflowId: string) => {
    try {
      // Only call API for persisted workflows (not drafts)
      if (!workflowId.startsWith(DRAFT_ID_PREFIX)) {
        await deleteWorkflowApi(workflowId);
      }

      // Update local state
      setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));

      // If the deleted workflow was selected, clear selection and update URL
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflowState(null);
        setWorkflowChatMessages([]);
        // Update URL without triggering Next.js navigation
        window.history.pushState(null, "", "/workflows");
      }
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    }
  }, [selectedWorkflow]);

  const renameWorkflowHandler = React.useCallback(async (workflowId: string, newName: string) => {
    try {
      // Only call API for persisted workflows (not drafts)
      if (!workflowId.startsWith(DRAFT_ID_PREFIX)) {
        await updateWorkflowApi(workflowId, { name: newName });
      }

      // Update local state
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflowId
            ? { ...w, name: newName, lastEditedAt: new Date() }
            : w
        )
      );

      // Update selected workflow if it's the one being renamed
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflowState((prev) =>
          prev ? { ...prev, name: newName, lastEditedAt: new Date() } : null
        );
      }
    } catch (error) {
      console.error("Failed to rename workflow:", error);
    }
  }, [selectedWorkflow]);

  const createWorkflowHandler = React.useCallback(() => {
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    // Create a draft workflow locally (not persisted to DB until first message)
    const draftId = `${DRAFT_ID_PREFIX}${crypto.randomUUID()}`;
    const now = new Date();

    const draftWorkflow: WorkflowDetail = {
      id: draftId,
      name: "New Workflow",
      description: "Describe what this workflow does",
      version: 1,
      steps: [],
      lastEditedAt: now,
      createdAt: now,
    };

    // Update local state
    setWorkflows((prev) => [draftWorkflow, ...prev]);

    // Set selected workflow state directly
    setSelectedWorkflowState(draftWorkflow);

    // Initialize the chat for the new workflow
    setWorkflowChatMessages([
      {
        id: `init-${draftWorkflow.id}`,
        role: "assistant" as const,
        content: `This is a **new workflow**. It currently has 0 steps.\n\nWorkflows are reusable procedures. When a user selects this workflow in chat, their message is the input, and each step is a prompt whose output flows to the next.\n\nDescribe what you want this workflow to do and I'll propose steps. For example:\n- "Evaluate a startup idea by estimating TAM, listing competitors, and making a recommendation"\n- "Summarize a customer interview and extract action items"`,
        createdAt: now,
      },
    ]);

    // Update URL to show draft workflow (use /workflows/new for drafts)
    window.history.replaceState(null, "", `/workflows/new`);
  }, [user?.id]);

  const sendWorkflowChatMessageHandler = React.useCallback(async (content: string, modelId: string) => {
    if (!content.trim() || isWorkflowChatLoading || !selectedWorkflow || !user?.id) return;

    // clear any pending proposal when sending a new message
    setPendingProposal(null);

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      createdAt: new Date(),
    };

    setWorkflowChatMessages((prev) => [...prev, userMessage]);
    setWorkflowChatInput("");
    setIsWorkflowChatLoading(true);

    try {
      let workflowId = selectedWorkflow.id;

      // If this is a draft workflow, persist it to DB first
      if (selectedWorkflow.id.startsWith(DRAFT_ID_PREFIX)) {
        const createdWorkflow = await createWorkflowApi({
          userId: user.id,
          name: selectedWorkflow.name,
          description: selectedWorkflow.description,
        });

        workflowId = createdWorkflow.id;

        // Update the workflow in local state with real ID
        const persistedWorkflow: WorkflowDetail = {
          ...selectedWorkflow,
          id: createdWorkflow.id,
          lastEditedAt: new Date(createdWorkflow.updatedAt),
          createdAt: new Date(createdWorkflow.createdAt),
        };

        // Replace draft with persisted workflow in list
        setWorkflows((prev) =>
          prev.map((w) => (w.id === selectedWorkflow.id ? persistedWorkflow : w))
        );

        // Update selected workflow
        setSelectedWorkflowState(persistedWorkflow);

        // Update URL to real workflow ID
        window.history.replaceState(null, "", `/workflows/${createdWorkflow.id}`);
      }

      // Call API to send message
      const response = await sendWorkflowChatMessageApi(workflowId, {
        content: content.trim(),
        modelId,
      });

      // Update user message with actual ID from server
      setWorkflowChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? {
                ...msg,
                id: response.userMessage.id,
                createdAt: new Date(response.userMessage.createdAt),
              }
            : msg
        )
      );

      // Add assistant message if present
      if (response.assistantMessage) {
        const assistantMessage: ChatMessage = {
          id: response.assistantMessage.id,
          role: "assistant",
          content: response.assistantMessage.content,
          createdAt: new Date(response.assistantMessage.createdAt),
        };
        setWorkflowChatMessages((prev) => [...prev, assistantMessage]);
      } else if (response.error) {
        // Handle error case - show error message from assistant
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${response.error.message}. Please try again.`,
          createdAt: new Date(),
        };
        setWorkflowChatMessages((prev) => [...prev, errorMessage]);
      }

      // store proposal if present
      if (response.proposedChanges) {
        setPendingProposal(response.proposedChanges);
      }
    } catch (error) {
      console.error("Failed to send workflow chat message:", error);

      // Show error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I couldn't process your message. Please try again.",
        createdAt: new Date(),
      };
      setWorkflowChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsWorkflowChatLoading(false);
    }
  }, [isWorkflowChatLoading, selectedWorkflow, user?.id]);

  const applyWorkflowProposalHandler = React.useCallback(async () => {
    if (!pendingProposal || !selectedWorkflow) return;

    setIsApplyingProposal(true);

    try {
      const response = await applyWorkflowChatProposalApi(
        selectedWorkflow.id,
        pendingProposal.proposalId
      );

      const updatedWorkflow: WorkflowDetail = {
        ...selectedWorkflow,
        version: response.workflowVersion.versionNumber,
        steps: response.workflowVersion.steps.map((step) => ({
          id: step.id,
          name: step.name,
          prompt: step.prompt,
          tools: step.tools,
          order: step.order,
        })),
        lastEditedAt: new Date(),
      };

      // update selected workflow and list
      setSelectedWorkflowState(updatedWorkflow);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w))
      );

      // clear proposal after applying
      setPendingProposal(null);
    } catch (error) {
      console.error("Failed to apply workflow proposal:", error);
    } finally {
      setIsApplyingProposal(false);
    }
  }, [pendingProposal, selectedWorkflow]);

  const rejectWorkflowProposalHandler = React.useCallback(() => {
    setPendingProposal(null);
  }, []);

  const value = React.useMemo(
    () => ({
      workflows,
      isLoading,
      selectedWorkflow,
      setSelectedWorkflow,
      selectWorkflowById,
      deleteWorkflow: deleteWorkflowHandler,
      renameWorkflow: renameWorkflowHandler,
      createWorkflow: createWorkflowHandler,
      workflowChatMessages,
      workflowChatInput,
      setWorkflowChatInput,
      sendWorkflowChatMessage: sendWorkflowChatMessageHandler,
      isWorkflowChatLoading,
      pendingProposal,
      applyWorkflowProposal: applyWorkflowProposalHandler,
      rejectWorkflowProposal: rejectWorkflowProposalHandler,
      isApplyingProposal,
    }),
    [
      workflows,
      isLoading,
      selectedWorkflow,
      setSelectedWorkflow,
      selectWorkflowById,
      deleteWorkflowHandler,
      renameWorkflowHandler,
      createWorkflowHandler,
      workflowChatMessages,
      workflowChatInput,
      sendWorkflowChatMessageHandler,
      isWorkflowChatLoading,
      pendingProposal,
      applyWorkflowProposalHandler,
      rejectWorkflowProposalHandler,
      isApplyingProposal,
    ]
  );

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

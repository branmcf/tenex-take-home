"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { WorkflowDetail } from "@/components/workflows/types";
import {
  createWorkflow as createWorkflowApi,
  updateWorkflow as updateWorkflowApi,
  deleteWorkflow as deleteWorkflowApi,
  getWorkflowById as getWorkflowByIdApi,
  getWorkflowChatMessages,
  sendWorkflowChatMessage as sendWorkflowChatMessageApi,
} from "@/lib/api";
import { useAuth } from "@/hooks";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
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
  const router = useRouter();
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
    setSelectedWorkflowState(workflow);

    // Update URL to reflect selected workflow
    if (workflow) {
      router.push(`/workflows/${workflow.id}`);

      // Load full workflow details if steps are empty
      if (workflow.steps.length === 0) {
        try {
          const fullWorkflow = await getWorkflowByIdApi(workflow.id);
          const workflowDetail: WorkflowDetail = {
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
          setSelectedWorkflowState(workflowDetail);

          // Update in the workflows list too
          setWorkflows((prev) =>
            prev.map((w) => (w.id === workflow.id ? workflowDetail : w))
          );

          // Load chat messages
          await loadWorkflowChatMessages(workflowDetail.id, workflowDetail.name, workflowDetail.steps.length);
        } catch (error) {
          console.error("Failed to load workflow details:", error);
          // Still load chat messages with current data
          await loadWorkflowChatMessages(workflow.id, workflow.name, workflow.steps.length);
        }
      } else {
        // Load chat messages with current workflow data
        await loadWorkflowChatMessages(workflow.id, workflow.name, workflow.steps.length);
      }
    } else {
      router.push('/workflows');
      setWorkflowChatMessages([]);
    }
  }, [router, loadWorkflowChatMessages]);

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

      // If the deleted workflow was selected, clear selection and navigate back
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflowState(null);
        setWorkflowChatMessages([]);
        router.push('/workflows');
      }
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    }
  }, [selectedWorkflow, router]);

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
        content: `This is a **new workflow**. It currently has 0 steps.\n\nDescribe what you want this workflow to do and I'll help you build it. For example:\n- "Create a workflow that validates user input and sends notifications"\n- "Add a step that processes uploaded files"`,
        createdAt: now,
      },
    ]);

    // Update URL to show draft workflow (use /workflows/new for drafts)
    window.history.replaceState(null, "", `/workflows/new`);
  }, [user?.id]);

  const sendWorkflowChatMessageHandler = React.useCallback(async (content: string, modelId: string) => {
    if (!content.trim() || isWorkflowChatLoading || !selectedWorkflow || !user?.id) return;

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
    ]
  );

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

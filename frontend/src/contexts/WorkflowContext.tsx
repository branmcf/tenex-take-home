"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { WorkflowDetail } from "@/components/workflows/types";
import { MOCK_WORKFLOW_CONVERSATIONS, generateMockStep } from "@/lib/mocks/workflows";

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
  sendWorkflowChatMessage: (content: string) => void;
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

export function WorkflowProvider({
  children,
  initialWorkflows,
  initialWorkflowId,
}: WorkflowProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [workflows, setWorkflows] = React.useState<WorkflowDetail[]>(initialWorkflows);
  const [isLoading] = React.useState(false);
  // Start with no workflow selected, or load from URL if provided
  const [selectedWorkflow, setSelectedWorkflowState] = React.useState<WorkflowDetail | null>(() => {
    if (initialWorkflowId) {
      return initialWorkflows.find((w) => w.id === initialWorkflowId) ?? null;
    }
    return null;
  });

  // Chat state for workflow authoring
  const [workflowChatMessages, setWorkflowChatMessages] = React.useState<ChatMessage[]>(() => {
    // Initialize conversation if loading from URL
    if (initialWorkflowId) {
      const initialWorkflow = initialWorkflows.find((w) => w.id === initialWorkflowId);
      if (initialWorkflow) {
        const existingConversation = MOCK_WORKFLOW_CONVERSATIONS.find(
          (c) => c.workflowId === initialWorkflow.id
        );
        if (existingConversation) {
          return existingConversation.messages;
        }
        return [
          {
            id: `init-${initialWorkflow.id}`,
            role: "assistant" as const,
            content: `This is the **${initialWorkflow.name}** workflow. It currently has ${initialWorkflow.steps.length} step${initialWorkflow.steps.length !== 1 ? 's' : ''}.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
            createdAt: initialWorkflow.createdAt,
          },
        ];
      }
    }
    return [];
  });
  const [workflowChatInput, setWorkflowChatInput] = React.useState("");
  const [isWorkflowChatLoading, setIsWorkflowChatLoading] = React.useState(false);

  // Load conversation history when workflow changes
  const setSelectedWorkflow = React.useCallback((workflow: WorkflowDetail | null) => {
    setSelectedWorkflowState(workflow);

    // Update URL to reflect selected workflow
    if (workflow) {
      router.push(`/workflows/${workflow.id}`);
    } else {
      router.push('/workflows');
    }

    if (workflow) {
      // Load existing conversation for this workflow
      const existingConversation = MOCK_WORKFLOW_CONVERSATIONS.find(
        (c) => c.workflowId === workflow.id
      );
      if (existingConversation) {
        setWorkflowChatMessages(existingConversation.messages);
      } else {
        // If no existing conversation, start with a system message about the workflow
        setWorkflowChatMessages([
          {
            id: `init-${workflow.id}`,
            role: "assistant",
            content: `This is the **${workflow.name}** workflow. It currently has ${workflow.steps.length} step${workflow.steps.length !== 1 ? 's' : ''}.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
            createdAt: workflow.createdAt,
          },
        ]);
      }
    } else {
      setWorkflowChatMessages([]);
    }
  }, [router]);

  const selectWorkflowById = React.useCallback((workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow) {
      setSelectedWorkflow(workflow);
    }
  }, [workflows, setSelectedWorkflow]);

  const deleteWorkflow = React.useCallback((workflowId: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== workflowId));
    // If the deleted workflow was selected, clear selection and navigate back
    if (selectedWorkflow?.id === workflowId) {
      setSelectedWorkflowState(null);
      setWorkflowChatMessages([]);
      router.push('/workflows');
    }
  }, [selectedWorkflow, router]);

  const renameWorkflow = React.useCallback((workflowId: string, newName: string) => {
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
  }, [selectedWorkflow]);

  const createWorkflow = React.useCallback(() => {
    const newWorkflow: WorkflowDetail = {
      id: `workflow-${Date.now()}`,
      name: "New Workflow",
      description: "Describe what this workflow does",
      version: 1,
      steps: [],
      lastEditedAt: new Date(),
      createdAt: new Date(),
    };
    setWorkflows((prev) => [newWorkflow, ...prev]);
    // Set selected workflow state directly without triggering navigation remount
    setSelectedWorkflowState(newWorkflow);
    // Initialize the chat for the new workflow
    setWorkflowChatMessages([
      {
        id: `init-${newWorkflow.id}`,
        role: "assistant" as const,
        content: `This is the **${newWorkflow.name}** workflow. It currently has 0 steps.\n\nYou can modify this workflow by describing changes in natural language. For example:\n- "Add a validation step at the beginning"\n- "Remove the last step"\n- "Add a notification tool to step 2"`,
        createdAt: newWorkflow.createdAt,
      },
    ]);
    // Update URL without triggering a full navigation/remount
    window.history.replaceState(null, "", `/workflows/${newWorkflow.id}`);
  }, []);

  const sendWorkflowChatMessage = React.useCallback((content: string) => {
    if (!content.trim() || isWorkflowChatLoading || !selectedWorkflow) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      createdAt: new Date(),
    };

    setWorkflowChatMessages((prev) => [...prev, userMessage]);
    setWorkflowChatInput("");
    setIsWorkflowChatLoading(true);

    // Simulate workflow modification based on user input
    // TODO: This entire block will be replaced with actual backend API calls
    // that process natural language and return the updated workflow DAG
    setTimeout(() => {
      // Generate a mock response and potentially modify the workflow
      const lowerContent = content.toLowerCase();
      let responseText = "";
      let updatedSteps = [...selectedWorkflow.steps];
      let stepsChanged = false;

      if (lowerContent.includes("add") && (lowerContent.includes("step") || lowerContent.includes("node"))) {
        // TODO: Replace with backend API call that compiles natural language into workflow step
        // The backend will parse the user's intent and return the appropriate step configuration
        const newStepNumber = updatedSteps.length + 1;
        const newStep = generateMockStep(newStepNumber);
        updatedSteps.push(newStep);
        stepsChanged = true;
        responseText = `I've added a new step: **${newStep.name}**.\n\nThe workflow now has ${updatedSteps.length} steps. The new step will ${newStep.prompt.toLowerCase()}`;
      } else if (lowerContent.includes("remove") || lowerContent.includes("delete")) {
        // TODO: Replace with backend API call to handle step removal
        if (updatedSteps.length > 0) {
          const removedStep = updatedSteps.pop();
          // Renumber remaining steps
          updatedSteps = updatedSteps.map((s, i) => ({ ...s, order: i + 1 }));
          stepsChanged = true;
          responseText = `I've removed the last step: **${removedStep?.name}**.\n\nThe workflow now has ${updatedSteps.length} step${updatedSteps.length !== 1 ? 's' : ''}.`;
        } else {
          responseText = "The workflow doesn't have any steps to remove.";
        }
      } else if (lowerContent.includes("tool")) {
        // TODO: Replace with backend API call to handle tool configuration
        // The backend will determine which tool to add based on natural language
        if (updatedSteps.length > 0) {
          const lastStep = updatedSteps[updatedSteps.length - 1];
          const newTool = {
            id: `tool-${Date.now()}`,
            name: "Custom Tool",
            description: "A custom tool based on your request",
          };
          updatedSteps[updatedSteps.length - 1] = {
            ...lastStep,
            tools: [...lastStep.tools, newTool],
          };
          stepsChanged = true;
          responseText = `I've added a new tool to **${lastStep.name}**.\n\nThis step now has ${updatedSteps[updatedSteps.length - 1].tools.length} tool${updatedSteps[updatedSteps.length - 1].tools.length !== 1 ? 's' : ''}.`;
        } else {
          responseText = "Please add a step first before adding tools.";
        }
      } else {
        // Generic response
        responseText = `I understand you want to modify the **${selectedWorkflow.name}** workflow.\n\nYou can:\n- **Add steps**: "Add a validation step"\n- **Remove steps**: "Remove the last step"\n- **Add tools**: "Add a notification tool"\n\nWhat specific changes would you like to make?`;
      }

      // Update the workflow if steps changed
      if (stepsChanged) {
        const updatedWorkflow: WorkflowDetail = {
          ...selectedWorkflow,
          steps: updatedSteps,
          version: selectedWorkflow.version + 1,
          lastEditedAt: new Date(),
        };

        // Update in the list
        setWorkflows((prev) =>
          prev.map((w) => (w.id === selectedWorkflow.id ? updatedWorkflow : w))
        );

        // Update selected workflow
        setSelectedWorkflowState(updatedWorkflow);
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseText,
        createdAt: new Date(),
      };
      setWorkflowChatMessages((prev) => [...prev, assistantMessage]);
      setIsWorkflowChatLoading(false);
    }, 1500);
  }, [isWorkflowChatLoading, selectedWorkflow]);

  const value = React.useMemo(
    () => ({
      workflows,
      isLoading,
      selectedWorkflow,
      setSelectedWorkflow,
      selectWorkflowById,
      deleteWorkflow,
      renameWorkflow,
      createWorkflow,
      workflowChatMessages,
      workflowChatInput,
      setWorkflowChatInput,
      sendWorkflowChatMessage,
      isWorkflowChatLoading,
    }),
    [
      workflows,
      isLoading,
      selectedWorkflow,
      setSelectedWorkflow,
      selectWorkflowById,
      deleteWorkflow,
      renameWorkflow,
      createWorkflow,
      workflowChatMessages,
      workflowChatInput,
      sendWorkflowChatMessage,
      isWorkflowChatLoading,
    ]
  );

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

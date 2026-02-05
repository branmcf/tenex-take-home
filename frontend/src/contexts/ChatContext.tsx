"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import type {
  Message,
  Model,
  Workflow,
  WorkflowRunState,
  WorkflowRunStep,
  WorkflowRunStatus,
} from "@/components/chat/types";
import {
  createMessage,
  getMessages,
  getWorkflowRuns,
  getUserModelPreference,
  updateUserModelPreference,
} from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";
import { useAuth } from "@/hooks";
import { useChatRefetch } from "./ChatRefetchContext";

interface ChatContextValue {
  // Current chat state
  currentChatId: string | null;
  messages: Message[];
  isLoading: boolean;

  // Available models and workflows
  models: Model[];
  workflows: Workflow[];

  // Model and workflow selection
  selectedModel: Model | undefined;
  setSelectedModel: (model: Model | undefined) => void;
  preferredModelId: string | null;
  savePreferredModel: (modelId: string) => void;
  isModelPreferenceLoaded: boolean;
  selectedWorkflow: string | undefined;
  setSelectedWorkflow: (workflowId: string | undefined) => void;

  // Workflow run state
  workflowRuns: WorkflowRunState[];
  isWorkflowRunning: boolean;

  // Chat actions
  sendMessage: (content: string) => void;
  startNewChat: () => void;
  loadChat: (chatId: string) => void;

  // Input state
  input: string;
  setInput: (value: string) => void;
}

const ChatContext = React.createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: React.ReactNode;
  models: Model[];
  workflows: Workflow[];
  initialChatId?: string;
}

export function ChatProvider({
  children,
  models,
  workflows,
  initialChatId,
}: ChatProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { triggerRefetch } = useChatRefetch();

  const [currentChatId, setCurrentChatId] = React.useState<string | null>(
    initialChatId ?? null
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [selectedModel, setSelectedModelState] = React.useState<Model | undefined>(
    undefined
  );
  const [preferredModelId, setPreferredModelId] = React.useState<string | null>(null);
  const [isModelPreferenceLoaded, setIsModelPreferenceLoaded] = React.useState(false);
  const [hasUserSelectedModel, setHasUserSelectedModel] = React.useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<
    string | undefined
  >();
  const [workflowRuns, setWorkflowRuns] = React.useState<WorkflowRunState[]>([]);

  // Keep reference to the SSE connection for workflow runs
  const workflowStreamRef = React.useRef<EventSource | null>(null);
  const activeWorkflowRunIdRef = React.useRef<string | null>(null);

  // Ref to track when we're actively sending a message in a new chat
  // This prevents the URL change from triggering a message fetch that would overwrite optimistic updates
  const isSendingNewChatRef = React.useRef(false);

  // Load the user's saved model preference
  React.useEffect(() => {
    if (!user?.id) {
      setPreferredModelId(null);
      setIsModelPreferenceLoaded(true);
      return;
    }

    setIsModelPreferenceLoaded(false);

    getUserModelPreference(user.id)
      .then((modelId) => {
        setPreferredModelId(modelId);
      })
      .catch(() => {
        setPreferredModelId(null);
      })
      .finally(() => {
        setIsModelPreferenceLoaded(true);
      });
  }, [user?.id]);

  // Select a model once the preference has loaded
  React.useEffect(() => {
    if (!isModelPreferenceLoaded || models.length === 0 || selectedModel) {
      return;
    }

    const preferred = preferredModelId
      ? models.find((model) => model.id === preferredModelId)
      : undefined;

    setSelectedModelState(preferred ?? models[0]);
  }, [isModelPreferenceLoaded, models, preferredModelId, selectedModel]);

  const savePreferredModel = React.useCallback(
    (modelId: string) => {
      if (!user?.id) {
        return;
      }

      setPreferredModelId(modelId);

      updateUserModelPreference(user.id, modelId).catch((error) => {
        console.error("Failed to save model preference:", error);
      });
    },
    [user?.id]
  );

  const setSelectedModel = React.useCallback(
    (model: Model | undefined) => {
      setSelectedModelState(model);
      if (model) {
        setHasUserSelectedModel(true);
        savePreferredModel(model.id);
      }
    },
    [savePreferredModel]
  );

  const closeWorkflowStream = React.useCallback(() => {
    if (workflowStreamRef.current) {
      workflowStreamRef.current.close();
      workflowStreamRef.current = null;
    }
    activeWorkflowRunIdRef.current = null;
  }, []);

  const startWorkflowStream = React.useCallback(
    (run: WorkflowRunState) => {
      closeWorkflowStream();

      const streamUrl = `${API_BASE_URL}/api/chats/${run.chatId}/workflow-runs/${run.id}/stream`;
      const eventSource = new EventSource(streamUrl, {
        withCredentials: true,
      });

      workflowStreamRef.current = eventSource;
      activeWorkflowRunIdRef.current = run.id;

      eventSource.onmessage = (event) => {
        let payload: any;
        try {
          payload = JSON.parse(event.data);
        } catch (err) {
          return;
        }

        if (payload.type === "snapshot") {
          const workflowRun = payload.workflowRun as {
            id: string;
            status: WorkflowRunStatus;
            startedAt?: string | null;
            completedAt?: string | null;
          };

          const steps = Array.isArray(payload.steps) ? payload.steps : [];

          const mappedSteps: WorkflowRunStep[] = steps.map((step: any) => ({
            id: step.id,
            name: step.name ?? step.id,
            status: step.status,
            startedAt: step.startedAt ?? null,
            completedAt: step.completedAt ?? null,
            error: step.error ?? null,
            output: step.output ?? null,
            logs: step.logs ?? null,
            toolCalls: step.toolCalls ?? null,
          }));

          const messagePayload = payload.message as
            | {
                id: string;
                role: "user" | "assistant" | "system";
                content: string;
                createdAt: string;
              }
            | undefined;

          const streamMessage: Message | undefined = messagePayload
            ? {
                id: messagePayload.id,
                role: messagePayload.role,
                content: messagePayload.content,
                createdAt: new Date(messagePayload.createdAt),
              }
            : undefined;

          setWorkflowRuns((prev) => {
            const index = prev.findIndex((existing) => existing.id === workflowRun.id);
            const nextRun: WorkflowRunState = {
              id: workflowRun.id,
              status: workflowRun.status,
              startedAt: workflowRun.startedAt ?? null,
              completedAt: workflowRun.completedAt ?? null,
              steps: mappedSteps,
              message: streamMessage,
              anchorMessageId: run.anchorMessageId,
              chatId: run.chatId,
              isNewChat: run.isNewChat,
            };

            if (index === -1) {
              return [...prev, nextRun];
            }

            const next = [...prev];
            next[index] = nextRun;
            return next;
          });

          if (streamMessage) {
            setMessages((prev) => {
              const exists = prev.some((existing) => existing.id === streamMessage.id);
              if (exists) {
                return prev;
              }
              return [...prev, streamMessage];
            });

            setIsLoading(false);

            if (run.isNewChat) {
              setTimeout(() => {
                triggerRefetch();
              }, 3500);
            }
          }

          if (
            workflowRun.status !== "RUNNING" &&
            streamMessage &&
            workflowStreamRef.current
          ) {
            closeWorkflowStream();
          }
        }

        if (payload.type === "complete") {
          setIsLoading(false);
          closeWorkflowStream();
        }

        if (payload.type === "error") {
          setIsLoading(false);
          closeWorkflowStream();
          toast.error("Workflow run failed", {
            description: payload.error?.message ?? "Please try again.",
            duration: 5000,
          });
        }
      };

      eventSource.onerror = () => {
        setIsLoading(false);
        closeWorkflowStream();
        toast.error("Workflow stream disconnected", {
          description: "Please try again.",
          duration: 5000,
        });
      };
    },
    [closeWorkflowStream, triggerRefetch]
  );

  React.useEffect(() => {
    return () => {
      closeWorkflowStream();
    };
  }, [closeWorkflowStream]);

  // Extract chatId from URL pathname
  const chatIdFromUrl = React.useMemo(() => {
    const match = pathname.match(/^\/chats\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  // Load messages when URL changes (not just initialChatId prop)
  React.useEffect(() => {
    // Explicitly at home page - always clear chat state
    if (pathname === "/") {
      setMessages([]);
      setCurrentChatId(null);
      setIsLoadingMessages(false);
      setWorkflowRuns([]);
      closeWorkflowStream();
      return;
    }

    // Skip fetching if we're actively sending a message in a new chat
    // This prevents the URL change from overwriting optimistic message updates
    if (isSendingNewChatRef.current) {
      return;
    }

    const chatIdToLoad = chatIdFromUrl || initialChatId;

    if (chatIdToLoad && chatIdToLoad !== "new") {
      setIsLoadingMessages(true);
      setCurrentChatId(chatIdToLoad);

      Promise.all([getMessages(chatIdToLoad), getWorkflowRuns(chatIdToLoad)])
        .then(([messageData, workflowRunData]) => {
          // Convert string dates to Date objects
          const messagesWithDates: Message[] = messageData.map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          }));
          setMessages(messagesWithDates);

          const runs: WorkflowRunState[] = workflowRunData.map((run) => ({
            id: run.id,
            status: run.status,
            startedAt: run.startedAt ?? null,
            completedAt: run.completedAt ?? null,
            steps: run.steps.map((step) => ({
              id: step.id,
              name: step.name,
              status: step.status,
              startedAt: step.startedAt ?? null,
              completedAt: step.completedAt ?? null,
              output: step.output ?? null,
              error: step.error ?? null,
              logs: step.logs ?? null,
              toolCalls: step.toolCalls ?? null,
            })),
            anchorMessageId: run.triggerMessageId,
            chatId: chatIdToLoad,
            isNewChat: false,
          }));

          setWorkflowRuns(runs);
        })
        .catch((error) => {
          console.error("Failed to load chat history:", error);
          setMessages([]);
          setWorkflowRuns([]);
        })
        .finally(() => {
          setIsLoadingMessages(false);
        });
    }
  }, [pathname, chatIdFromUrl, initialChatId, closeWorkflowStream]);

  // Track if this is a fresh session (no messages yet)
  const hasMessages = messages.length > 0;

  const isWorkflowRunning = React.useMemo(
    () => workflowRuns.some((run) => run.status === "RUNNING"),
    [workflowRuns]
  );

  React.useEffect(() => {
    const runningRun = workflowRuns.find((run) => run.status === "RUNNING");

    if (
      runningRun &&
      activeWorkflowRunIdRef.current !== runningRun.id
    ) {
      startWorkflowStream(runningRun);
    }
  }, [workflowRuns, startWorkflowStream]);

  // Start a new chat - clears messages and navigates to home
  const startNewChat = React.useCallback(() => {
    // Clear chat state
    setMessages([]);
    setCurrentChatId(null);
    setInput("");
    setIsLoading(false);
    setWorkflowRuns([]);
    closeWorkflowStream();

    // Check if we're on a non-chat page (like /workflows)
    // If so, use router.push to navigate to home
    const isOnChatPage = pathname === "/" || pathname.startsWith("/chats/");

    if (!isOnChatPage) {
      // Navigate to home page
      router.push("/");
    } else if (hasMessages || currentChatId) {
      // If on a chat page with existing chat, update URL to root without remount
      window.history.replaceState(null, "", "/");
    }
  }, [hasMessages, currentChatId, pathname, router]);

  // Load an existing chat (navigates to chat page)
  const loadChat = React.useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setMessages([]);
    setWorkflowRuns([]);
    closeWorkflowStream();
    // Use router.push for loading existing chats since we want full navigation
    router.push(`/chats/${chatId}`);
  }, [router, closeWorkflowStream]);

  // Send a message
  const sendMessage = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !selectedModel || !user) return;

      if (isWorkflowRunning) {
        toast.error("Workflow is still running", {
          description: "Please wait for it to finish before sending a new message.",
          duration: 4000,
        });
        return;
      }

      // Track if this is a new chat
      const isNewChat = !currentChatId;
      let keepLoading = false;

      // Generate a new chat ID if this is the first message
      let chatIdForRequest = currentChatId;
      if (!chatIdForRequest) {
        chatIdForRequest = crypto.randomUUID();
        setCurrentChatId(chatIdForRequest);
        // Mark that we're sending a new chat message to prevent the URL change
        // from triggering a message fetch that would overwrite our optimistic update
        isSendingNewChatRef.current = true;
        // Update URL immediately for new chats
        window.history.replaceState(null, "", `/chats/${chatIdForRequest}`);
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await createMessage(chatIdForRequest, {
          content: content.trim(),
          modelId: selectedModel.id,
          userId: user.id,
          workflowId: selectedWorkflow ?? null,
        });

        if (response.workflowRunId) {

          const serverUserMessage: Message = {
            ...response.userMessage,
            createdAt: new Date(response.userMessage.createdAt),
          };

          setMessages((prev) =>
            prev.map((msg) => (msg.id === userMessage.id ? serverUserMessage : msg))
          );

          const runState: WorkflowRunState = {
            id: response.workflowRunId,
            status: "RUNNING",
            steps: [],
            anchorMessageId: serverUserMessage.id,
            chatId: chatIdForRequest,
            isNewChat,
          };

          setWorkflowRuns((prev) => {
            const index = prev.findIndex((existing) => existing.id === runState.id);
            if (index === -1) {
              return [...prev, runState];
            }
            const next = [...prev];
            next[index] = runState;
            return next;
          });
          startWorkflowStream(runState);
          return;
        }

        // Check if the response has an error (partial success - LLM failed but user message saved)
        if (response.error || !response.assistantMessage) {
          // Remove the optimistic user message (we'll fetch from server)
          setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

          // Fetch messages from server to get the stored user message + system error message
          const messageData = await getMessages(chatIdForRequest);
          const messagesWithDates: Message[] = messageData.map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          }));
          setMessages(messagesWithDates);

          // Trigger sidebar refetch to show the new chat with fallback title
          if (isNewChat) {
            setTimeout(() => {
              triggerRefetch();
            }, 500);
          }

          // Show error toast for immediate feedback
          const errorTitle =
            response.error?.code === "WORKFLOW_RUN_FAILED"
              ? "Failed to start workflow"
              : "Failed to get AI response";
          const errorDescription =
            response.error?.message ??
            "Please check that the selected model's API key is configured.";

          toast.error(errorTitle, {
            description: errorDescription,
            duration: 5000,
          });
        } else {
          // Success - convert assistant message dates and add to messages
          const assistantMessage: Message = {
            ...response.assistantMessage,
            createdAt: new Date(response.assistantMessage.createdAt),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // If this was a new chat, trigger a refetch of the chat list
          // Wait for the backend to generate the title (it happens async)
          if (isNewChat) {
            setTimeout(() => {
              triggerRefetch();
            }, 3500); // Increased to 3.5 seconds to give more time for title generation
          }
        }
      } catch (error) {
        console.error("Failed to send message:", error);
        // Remove the optimistic user message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

        // If this was a new chat, revert the chat state so it doesn't appear in sidebar
        if (isNewChat) {
          setCurrentChatId(null);
          window.history.replaceState(null, "", "/");
        }

        // Show error toast to user
        const errorMessage = error instanceof Error ? error.message : "Failed to send message";
        toast.error(errorMessage, {
          description: "Please check that the selected model's API key is configured.",
          duration: 5000,
        });
      } finally {
        if (!keepLoading) {
          setIsLoading(false);
        }
        // Reset the ref so future URL changes can trigger message fetches
        isSendingNewChatRef.current = false;
      }
    },
    [
      isLoading,
      isWorkflowRunning,
      currentChatId,
      selectedModel,
      selectedWorkflow,
      user,
      triggerRefetch,
      startWorkflowStream,
    ]
  );

  const value = React.useMemo(
    () => ({
      currentChatId,
      messages,
      isLoading: isLoading || isLoadingMessages,
      models,
      workflows,
      selectedModel,
      setSelectedModel,
      preferredModelId,
      savePreferredModel,
      isModelPreferenceLoaded,
      selectedWorkflow,
      setSelectedWorkflow,
      workflowRuns,
      isWorkflowRunning,
      sendMessage,
      startNewChat,
      loadChat,
      input,
      setInput,
    }),
    [
      currentChatId,
      messages,
      isLoading,
      isLoadingMessages,
      models,
      workflows,
      selectedModel,
      setSelectedModel,
      preferredModelId,
      savePreferredModel,
      isModelPreferenceLoaded,
      selectedWorkflow,
      workflowRuns,
      isWorkflowRunning,
      sendMessage,
      startNewChat,
      loadChat,
      input,
      setInput,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

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

type WorkflowRunStepPayload = {
  id: string;
  name?: string;
  status: WorkflowRunStep["status"];
  startedAt?: string | null;
  completedAt?: string | null;
  error?: string | null;
  output?: string | null;
  logs?: unknown | null;
  toolCalls?: unknown | null;
};

type WorkflowStreamSnapshotPayload = {
  type: "snapshot";
  workflowRun: {
    id: string;
    status: WorkflowRunStatus;
    startedAt?: string | null;
    completedAt?: string | null;
  };
  steps?: WorkflowRunStepPayload[];
  message?: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: string;
  };
};

type WorkflowStreamErrorPayload = {
  type: "error";
  error?: { message?: string };
};

type WorkflowStreamCompletePayload = {
  type: "complete";
};

type WorkflowStreamPayload =
  | WorkflowStreamSnapshotPayload
  | WorkflowStreamErrorPayload
  | WorkflowStreamCompletePayload
  | { type: string; [key: string]: unknown };

const isWorkflowStreamSnapshot = (
  payload: WorkflowStreamPayload
): payload is WorkflowStreamSnapshotPayload => {
  return (
    payload.type === "snapshot" &&
    typeof (payload as WorkflowStreamSnapshotPayload).workflowRun === "object" &&
    (payload as WorkflowStreamSnapshotPayload).workflowRun !== null
  );
};

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
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<
    string | undefined
  >();
  const [workflowRuns, setWorkflowRuns] = React.useState<WorkflowRunState[]>([]);

  // Keep reference to the SSE connection for workflow runs
  const workflowStreamRef = React.useRef<EventSource | null>(null);
  const activeWorkflowRunIdRef = React.useRef<string | null>(null);

  // Keep reference to the SSE connection for chat title updates
  const chatEventsStreamRef = React.useRef<EventSource | null>(null);

  // Keep reference to the SSE connection for message streaming
  const messageStreamRef = React.useRef<EventSource | null>(null);

  // Ref to track when we're actively sending a message in a new chat
  // This prevents the URL change from triggering a message fetch that would overwrite optimistic updates
  const isSendingNewChatRef = React.useRef(false);

  // Close the message stream SSE connection
  const closeMessageStream = React.useCallback(() => {
    if (messageStreamRef.current) {
      messageStreamRef.current.close();
      messageStreamRef.current = null;
    }
  }, []);

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

  // Close the chat events SSE connection
  const closeChatEventsStream = React.useCallback(() => {
    if (chatEventsStreamRef.current) {
      chatEventsStreamRef.current.close();
      chatEventsStreamRef.current = null;
    }
  }, []);

  // Subscribe to chat events (title updates) for a new chat
  const subscribeToChatEvents = React.useCallback(
    (chatId: string) => {
      // Close any existing connection
      closeChatEventsStream();

      const streamUrl = `${API_BASE_URL}/api/chats/${chatId}/events`;
      const eventSource = new EventSource(streamUrl, {
        withCredentials: true,
      });

      chatEventsStreamRef.current = eventSource;

      eventSource.onmessage = (event) => {
        let payload: { type: string; chatId?: string; title?: string };
        try {
          payload = JSON.parse(event.data) as { type: string; chatId?: string; title?: string };
        } catch {
          return;
        }

        if (payload.type === "title_updated") {
          // Title is ready - trigger refetch and close the stream
          triggerRefetch();
          closeChatEventsStream();
        } else if (payload.type === "timeout") {
          // Timed out waiting for title - still trigger refetch in case title was set
          triggerRefetch();
          closeChatEventsStream();
        }
      };

      eventSource.onerror = () => {
        // On error, close the stream - the chat may still appear on next manual refresh
        closeChatEventsStream();
      };
    },
    [closeChatEventsStream, triggerRefetch]
  );

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
        let payload: WorkflowStreamPayload;
        try {
          payload = JSON.parse(event.data) as WorkflowStreamPayload;
        } catch {
          return;
        }

        if (isWorkflowStreamSnapshot(payload)) {
          const workflowRun = payload.workflowRun as {
            id: string;
            status: WorkflowRunStatus;
            startedAt?: string | null;
            completedAt?: string | null;
          };

          const steps = Array.isArray(payload.steps) ? payload.steps : [];

          const mappedSteps: WorkflowRunStep[] = steps.map((step) => ({
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

          const messagePayload = payload.message;

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
              subscribeToChatEvents(run.chatId);
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
          const errorPayload = payload as WorkflowStreamErrorPayload;
          setIsLoading(false);
          closeWorkflowStream();
          toast.error("Workflow run failed", {
            description: errorPayload.error?.message ?? "Please try again.",
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
    [closeWorkflowStream, subscribeToChatEvents]
  );

  React.useEffect(() => {
    return () => {
      closeWorkflowStream();
      closeChatEventsStream();
      closeMessageStream();
    };
  }, [closeWorkflowStream, closeChatEventsStream, closeMessageStream]);

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
    closeChatEventsStream();
    closeMessageStream();

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
  }, [hasMessages, currentChatId, pathname, router, closeWorkflowStream, closeChatEventsStream, closeMessageStream]);

  // Load an existing chat (navigates to chat page)
  const loadChat = React.useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    setMessages([]);
    setWorkflowRuns([]);
    closeWorkflowStream();
    closeChatEventsStream();
    closeMessageStream();
    // Use router.push for loading existing chats since we want full navigation
    router.push(`/chats/${chatId}`);
  }, [router, closeWorkflowStream, closeChatEventsStream, closeMessageStream]);

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

      // If a workflow is selected, use the non-streaming endpoint
      if (selectedWorkflow) {
        try {
          const response = await createMessage(chatIdForRequest, {
            content: content.trim(),
            modelId: selectedModel.id,
            userId: user.id,
            workflowId: selectedWorkflow,
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
        } catch (error) {
          console.error("Failed to send workflow message:", error);
          setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
          if (isNewChat) {
            setCurrentChatId(null);
            window.history.replaceState(null, "", "/");
          }
          toast.error("Failed to start workflow", {
            description: "Please try again.",
            duration: 5000,
          });
          setIsLoading(false);
          isSendingNewChatRef.current = false;
        }
        return;
      }

      // For regular chat, use the streaming endpoint
      closeMessageStream();

      // Create a placeholder assistant message for streaming
      const assistantMessageId = crypto.randomUUID();
      const streamingAssistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      // Build the streaming URL with query params
      const streamUrl = new URL(`${API_BASE_URL}/api/chats/${chatIdForRequest}/messages/stream`);

      // We need to POST to the stream endpoint, but EventSource only supports GET
      // So we'll use fetch with ReadableStream instead
      try {
        const response = await fetch(streamUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: content.trim(),
            modelId: selectedModel.id,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Stream request failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let buffer = "";
        let streamedContent = "";
        let hasAddedAssistantMessage = false;
        let finalAssistantMessage: Message | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              try {
                const payload = JSON.parse(data) as {
                  type: string;
                  message?: {
                    id: string;
                    role: "user" | "assistant" | "system";
                    content: string;
                    createdAt: string;
                    sources?: { url: string; title: string; description?: string }[];
                  };
                  token?: string;
                  chatId?: string;
                  error?: { message?: string; code?: string };
                };

                if (payload.type === "user_message" && payload.message) {
                  // Update the optimistic user message with the server's version
                  const serverUserMessage: Message = {
                    ...payload.message,
                    createdAt: new Date(payload.message.createdAt),
                  };
                  setMessages((prev) =>
                    prev.map((msg) => (msg.id === userMessage.id ? serverUserMessage : msg))
                  );
                }

                if (payload.type === "token" && payload.token) {
                  streamedContent += payload.token;

                  if (!hasAddedAssistantMessage) {
                    // Add the streaming assistant message
                    setMessages((prev) => [
                      ...prev,
                      { ...streamingAssistantMessage, content: streamedContent },
                    ]);
                    hasAddedAssistantMessage = true;
                  } else {
                    // Update the streaming assistant message
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: streamedContent }
                          : msg
                      )
                    );
                  }
                }

                if (payload.type === "complete" && payload.message) {
                  // Replace streaming message with final message
                  finalAssistantMessage = {
                    ...payload.message,
                    createdAt: new Date(payload.message.createdAt),
                  };

                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? finalAssistantMessage! : msg
                    )
                  );

                  // Subscribe to chat events for title updates on new chats
                  if (isNewChat) {
                    subscribeToChatEvents(chatIdForRequest);
                  }
                }

                if (payload.type === "error") {
                  // Remove the streaming assistant message if we added one
                  if (hasAddedAssistantMessage) {
                    setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
                  }

                  // Fetch messages from server to get any error messages
                  const messageData = await getMessages(chatIdForRequest);
                  const messagesWithDates: Message[] = messageData.map((msg) => ({
                    ...msg,
                    createdAt: new Date(msg.createdAt),
                  }));
                  setMessages(messagesWithDates);

                  if (isNewChat) {
                    subscribeToChatEvents(chatIdForRequest);
                  }

                  toast.error("Failed to get AI response", {
                    description: payload.error?.message ?? "Please try again.",
                    duration: 5000,
                  });
                }
              } catch {
                // Ignore JSON parse errors for incomplete messages
              }
            }
          }
        }

        setIsLoading(false);
        isSendingNewChatRef.current = false;
      } catch (error) {
        console.error("Failed to send message:", error);
        // Remove the optimistic user message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));

        // If this was a new chat, revert the chat state
        if (isNewChat) {
          setCurrentChatId(null);
          window.history.replaceState(null, "", "/");
        }

        toast.error("Failed to send message", {
          description: "Please check your connection and try again.",
          duration: 5000,
        });
        setIsLoading(false);
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
      subscribeToChatEvents,
      startWorkflowStream,
      closeMessageStream,
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

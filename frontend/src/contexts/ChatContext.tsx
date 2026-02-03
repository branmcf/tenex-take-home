"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import type { Message, Model, Workflow } from "@/components/chat/types";
import { createMessage, getMessages } from "@/lib/api";
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
  selectedWorkflow: string | undefined;
  setSelectedWorkflow: (workflowId: string | undefined) => void;

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
  const [selectedModel, setSelectedModel] = React.useState<Model | undefined>(
    models[0]
  );
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<
    string | undefined
  >();

  // Ref to track when we're actively sending a message in a new chat
  // This prevents the URL change from triggering a message fetch that would overwrite optimistic updates
  const isSendingNewChatRef = React.useRef(false);

  // Set selectedModel when models load asynchronously and no model is selected
  React.useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

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

      getMessages(chatIdToLoad)
        .then((messageData) => {
          // Convert string dates to Date objects
          const messagesWithDates: Message[] = messageData.map((msg) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          }));
          setMessages(messagesWithDates);
        })
        .catch((error) => {
          console.error("Failed to load messages:", error);
          setMessages([]);
        })
        .finally(() => {
          setIsLoadingMessages(false);
        });
    }
  }, [pathname, chatIdFromUrl, initialChatId]);

  // Track if this is a fresh session (no messages yet)
  const hasMessages = messages.length > 0;

  // Start a new chat - clears messages and navigates to home
  const startNewChat = React.useCallback(() => {
    // Clear chat state
    setMessages([]);
    setCurrentChatId(null);
    setInput("");
    setIsLoading(false);

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
    // Use router.push for loading existing chats since we want full navigation
    router.push(`/chats/${chatId}`);
  }, [router]);

  // Send a message
  const sendMessage = React.useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !selectedModel || !user) return;

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

      try {
        const response = await createMessage(chatIdForRequest, {
          content: content.trim(),
          modelId: selectedModel.id,
          userId: user.id,
        });

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
          toast.error("Failed to get AI response", {
            description: "Please check that the selected model's API key is configured.",
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
        setIsLoading(false);
        // Reset the ref so future URL changes can trigger message fetches
        isSendingNewChatRef.current = false;
      }
    },
    [isLoading, currentChatId, selectedModel, user, triggerRefetch]
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
      selectedWorkflow,
      setSelectedWorkflow,
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
      selectedWorkflow,
      sendMessage,
      startNewChat,
      loadChat,
      input,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

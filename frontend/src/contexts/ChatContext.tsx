"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Message, Model, Workflow } from "@/components/chat/types";
import type { ChatConversation } from "@/lib/mocks/chat";

interface ChatContextValue {
  // Current chat state
  currentChatId: string | null;
  messages: Message[];
  isLoading: boolean;

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
  mockResponses: string[];
  mockSources: Array<Array<{ url: string; title: string; description?: string }>>;
  mockConversations?: ChatConversation[];
  initialChatId?: string;
}

export function ChatProvider({
  children,
  models,
  mockResponses,
  mockSources,
  mockConversations = [],
  initialChatId,
}: ChatProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentChatId, setCurrentChatId] = React.useState<string | null>(
    initialChatId ?? null
  );
  const [messages, setMessages] = React.useState<Message[]>(() => {
    // Initialize messages if loading from URL
    if (initialChatId) {
      const conversation = mockConversations.find((c) => c.chatId === initialChatId);
      return conversation?.messages ?? [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState<Model | undefined>(
    models[0]
  );
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<
    string | undefined
  >();

  // Track if this is a fresh session (no messages yet)
  const hasMessages = messages.length > 0;

  // Generate a new chat ID
  const generateChatId = React.useCallback(() => {
    // In a real app, this would come from the backend
    return String(Math.floor(Math.random() * 10000));
  }, []);

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
    // In a real app, this would fetch from the backend
    setCurrentChatId(chatId);
    // Load mock messages for this chat
    const conversation = mockConversations.find((c) => c.chatId === chatId);
    setMessages(conversation?.messages ?? []);
    // Use router.push for loading existing chats since we want full navigation
    router.push(`/chats/${chatId}`);
  }, [router, mockConversations]);

  // Send a message
  const sendMessage = React.useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      };

      // If this is the first message, generate a chat ID and update URL
      // Do this BEFORE updating messages to ensure state is consistent
      if (!currentChatId && messages.length === 0) {
        const newChatId = generateChatId();
        setCurrentChatId(newChatId);
        // Update URL without triggering Next.js navigation/remount
        window.history.replaceState(null, "", `/chats/${newChatId}`);
      }

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      // Simulate API response
      const responseIndex = Math.floor(Math.random() * mockResponses.length);
      const response = mockResponses[responseIndex];
      const sources = mockSources[responseIndex % mockSources.length];

      setTimeout(() => {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
          createdAt: new Date(),
          sources,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    },
    [isLoading, currentChatId, messages.length, generateChatId, mockResponses, mockSources]
  );

  const value = React.useMemo(
    () => ({
      currentChatId,
      messages,
      isLoading,
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

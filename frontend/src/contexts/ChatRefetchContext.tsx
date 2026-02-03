"use client";

import * as React from "react";

interface ChatRefetchContextValue {
  registerRefetch: (refetch: () => void) => void;
  triggerRefetch: () => void;
}

const ChatRefetchContext = React.createContext<ChatRefetchContextValue | null>(null);

export function useChatRefetch() {
  const context = React.useContext(ChatRefetchContext);
  if (!context) {
    // Return no-op functions if provider isn't available
    return {
      registerRefetch: () => {},
      triggerRefetch: () => {},
    };
  }
  return context;
}

export function ChatRefetchProvider({ children }: { children: React.ReactNode }) {
  const refetchCallbackRef = React.useRef<(() => void) | null>(null);

  const registerRefetch = React.useCallback((refetch: () => void) => {
    refetchCallbackRef.current = refetch;
  }, []);

  const triggerRefetch = React.useCallback(() => {
    if (refetchCallbackRef.current) {
      refetchCallbackRef.current();
    }
  }, []);

  const value = React.useMemo(
    () => ({
      registerRefetch,
      triggerRefetch,
    }),
    [registerRefetch, triggerRefetch]
  );

  return (
    <ChatRefetchContext.Provider value={value}>
      {children}
    </ChatRefetchContext.Provider>
  );
}

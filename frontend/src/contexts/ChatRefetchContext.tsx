"use client";

import * as React from "react";

interface ChatRefetchContextValue {
  /**
   * Register a refetch callback. Returns an unregister function.
   * Multiple components can register their own refetch callbacks.
   */
  registerRefetch: (refetch: () => void) => () => void;
  triggerRefetch: () => void;
}

const ChatRefetchContext = React.createContext<ChatRefetchContextValue | null>(null);

export function useChatRefetch() {
  const context = React.useContext(ChatRefetchContext);
  if (!context) {
    // Return no-op functions if provider isn't available
    return {
      registerRefetch: () => () => {},
      triggerRefetch: () => {},
    };
  }
  return context;
}

export function ChatRefetchProvider({ children }: { children: React.ReactNode }) {
  // Use a Set to support multiple refetch callbacks
  const refetchCallbacksRef = React.useRef<Set<() => void>>(new Set());

  const registerRefetch = React.useCallback((refetch: () => void) => {
    refetchCallbacksRef.current.add(refetch);
    // Return unregister function
    return () => {
      refetchCallbacksRef.current.delete(refetch);
    };
  }, []);

  const triggerRefetch = React.useCallback(() => {
    // Call all registered refetch callbacks
    refetchCallbacksRef.current.forEach((callback) => {
      callback();
    });
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

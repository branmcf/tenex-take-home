"use client";

import * as React from "react";

export type ModalId = "search" | "workflow" | "settings" | null;

interface ModalContextValue {
  activeModal: ModalId;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const ModalContext = React.createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [activeModal, setActiveModal] = React.useState<ModalId>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const openModal = React.useCallback((id: ModalId) => {
    setActiveModal(id);
  }, []);

  const closeModal = React.useCallback(() => {
    setActiveModal(null);
  }, []);

  const value = React.useMemo(
    () => ({ activeModal, openModal, closeModal, contentRef }),
    [activeModal, openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

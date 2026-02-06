"use client";

import * as React from "react";
import { useModal, useChatContext, useChatRefetch } from "@/contexts";
import { SearchModal } from "@/components/search";
import { SettingsModal } from "@/components/settings";
import { WorkflowSearchModal } from "@/components/chat/WorkflowSearchModal";
import { useChats, useAuth } from "@/hooks";

export function ModalContainer() {
  const { activeModal, closeModal } = useModal();
  const { user } = useAuth();
  const { registerRefetch } = useChatRefetch();
  const {
    workflows,
    selectedWorkflow,
    setSelectedWorkflow,
  } = useChatContext();

  // Fetch chats for search modal
  const { chats, isLoading, refetch } = useChats({
    userId: user?.id || "",
    limit: 100,
    enabled: !!user?.id,
  });

  // Always register refetch so the search modal stays in sync even when closed
  React.useEffect(() => {
    const unregister = registerRefetch(refetch);
    return unregister;
  }, [registerRefetch, refetch]);

  return (
    <>
      <SearchModal
        isOpen={activeModal === "search"}
        onClose={closeModal}
        chats={chats}
        isLoading={isLoading}
      />

      <WorkflowSearchModal
        isOpen={activeModal === "workflow"}
        onClose={closeModal}
        workflows={workflows}
        selectedWorkflowId={selectedWorkflow}
        onSelect={setSelectedWorkflow}
      />

      <SettingsModal
        isOpen={activeModal === "settings"}
        onClose={closeModal}
      />
    </>
  );
}

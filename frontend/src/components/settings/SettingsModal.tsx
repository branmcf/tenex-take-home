"use client";

import * as React from "react";
import { X, SignOut, CircleNotch } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AccountTab } from "./AccountTab";
import { useAuth } from "@/hooks";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, signOut, isLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState("account");
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  // Handle escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("account");
    }
  }, [isOpen]);

  const handleSignOut = React.useCallback(async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }, [signOut]);

  if (!isOpen || !user) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]"
        style={{ height: "min(520px, 75vh)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Settings</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="size-4" />
            <span className="sr-only">Close settings</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="shrink-0 border-b border-border px-4">
            <TabsList className="h-auto w-full justify-start gap-4 rounded-none bg-transparent p-0">
              <TabsTrigger
                value="account"
                className="rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Account
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area - Fixed height with scroll */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="account" className="m-0 h-full p-4">
              <AccountTab user={user} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-4 py-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                disabled={isLoading || isSigningOut}
              >
                {isSigningOut ? (
                  <CircleNotch className="size-4 animate-spin" />
                ) : (
                  <SignOut className="size-4" />
                )}
                Log out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOut}>
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

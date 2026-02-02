"use client";

import { useState } from "react";
import { CircleNotch, Check, CaretDown, CaretUp } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { useAuth, type User } from "@/hooks";

interface AccountTabProps {
  user: User;
}

export function AccountTab({ user }: AccountTabProps) {
  const { updateEmail } = useAuth();
  const [email, setEmail] = useState(user.email);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

  const isEmailUser = user.provider === "email";
  const isOAuthUser = !isEmailUser;
  const hasEmailChanged = email !== user.email;

  const handleSaveEmail = async () => {
    if (!hasEmailChanged) return;

    setIsSavingEmail(true);
    setEmailError(null);
    setEmailSuccess(false);

    try {
      await updateEmail(email);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to update email");
    } finally {
      setIsSavingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <div className="space-y-3">
        <Label htmlFor="email">Email address</Label>
        {isOAuthUser ? (
          <>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Your email is managed by your sign-in provider and cannot be changed here.
            </p>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null);
                  setEmailSuccess(false);
                }}
                placeholder="you@example.com"
              />
              <Button
                onClick={handleSaveEmail}
                disabled={!hasEmailChanged || isSavingEmail}
                size="default"
              >
                {isSavingEmail ? (
                  <CircleNotch className="size-4 animate-spin" />
                ) : emailSuccess ? (
                  <Check className="size-4" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
            {emailSuccess && (
              <p className="text-sm text-emerald-600">Email updated successfully</p>
            )}
          </>
        )}
      </div>

      {/* Password Section - Only for email users */}
      {isEmailUser && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setIsPasswordExpanded(!isPasswordExpanded)}
            className="flex w-full items-center justify-between rounded-md border border-border bg-muted/50 px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted"
          >
            <span>Change password</span>
            {isPasswordExpanded ? (
              <CaretUp className="size-4 text-muted-foreground" />
            ) : (
              <CaretDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {isPasswordExpanded && (
            <div className="rounded-md border border-border bg-muted/30 p-4">
              <PasswordChangeForm onSuccess={() => setIsPasswordExpanded(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

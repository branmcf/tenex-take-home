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
  const { updateName, updateEmail } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

  const isEmailUser = user.provider === "email";
  const isOAuthUser = !isEmailUser;
  const hasNameChanged = name !== user.name;
  const hasEmailChanged = email !== user.email;

  const handleSaveName = async () => {
    if (!hasNameChanged) return;

    setIsSavingName(true);
    setNameError(null);
    setNameSuccess(false);

    try {
      await updateName(name);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Failed to update name");
    } finally {
      setIsSavingName(false);
    }
  };

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
      {/* Name Section */}
      <div className="space-y-3">
        <Label htmlFor="name">Name</Label>
        <div className="flex gap-2">
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(null);
              setNameSuccess(false);
            }}
            placeholder="Your name"
          />
          <Button
            onClick={handleSaveName}
            disabled={!hasNameChanged || isSavingName}
            size="default"
          >
            {isSavingName ? (
              <CircleNotch className="size-4 animate-spin" />
            ) : nameSuccess ? (
              <Check className="size-4" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
        {nameError && (
          <p className="text-sm text-destructive">{nameError}</p>
        )}
        {nameSuccess && (
          <p className="text-sm text-primary">Name updated successfully</p>
        )}
      </div>

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
              <p className="text-sm text-primary">Email updated successfully</p>
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

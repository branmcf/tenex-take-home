"use client";

import * as React from "react";
import { Copy, Check, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
} from "@/components/ui/message";
import { Source, SourceTrigger, SourceContent } from "@/components/ui/source";
import type { Message as MessageType } from "./types";

interface ChatMessageProps {
  message: MessageType;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // System message - distinct alert/banner style (not a bubble)
  if (isSystem) {
    return (
      <div className="w-full px-2 py-3">
        <div
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3",
            "bg-amber-50 border-amber-200 text-amber-900",
            "dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200"
          )}
        >
          <Warning className="h-5 w-5 shrink-0 mt-0.5" weight="fill" />
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <Message className="justify-end">
        <div className="group flex flex-col items-end gap-1 max-w-[85%] sm:max-w-[75%]">
          <MessageContent className="bg-primary text-primary-foreground px-4 py-3 border border-primary">
            {message.content}
          </MessageContent>
          <MessageActions
            className={cn(
              "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
              "mr-1"
            )}
          >
            <MessageAction tooltip={copied ? "Copied!" : "Copy"}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </MessageAction>
          </MessageActions>
        </div>
      </Message>
    );
  }

  return (
    <Message className="justify-start">
      <div className="group flex w-full flex-col gap-2">
        <MessageContent
          className="prose prose-sm dark:prose-invert max-w-none"
          markdown
        >
          {message.content}
        </MessageContent>
        <MessageActions
          className={cn(
            "-ml-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
            isLast && "opacity-100"
          )}
        >
          <MessageAction tooltip={copied ? "Copied!" : "Copy"}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </MessageAction>
        </MessageActions>
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {message.sources.map((source) => (
              <Source key={source.url} href={source.url}>
                <SourceTrigger showFavicon />
                <SourceContent
                  title={source.title}
                  description={source.description}
                />
              </Source>
            ))}
          </div>
        )}
      </div>
    </Message>
  );
}

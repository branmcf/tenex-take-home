"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Message wrapper
export type MessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function Message({ children, className, ...props }: MessageProps) {
  return (
    <div className={cn("flex gap-3", className)} {...props}>
      {children}
    </div>
  );
}

// Message content with optional markdown
export type MessageContentProps = {
  children: React.ReactNode;
  markdown?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function MessageContent({
  children,
  markdown = false,
  className,
  ...props
}: MessageContentProps) {
  // For markdown content (assistant messages), use chat-prose
  // For non-markdown (user messages), the parent applies chat-user-text
  const baseClasses = cn(
    "break-words",
    markdown ? "chat-prose" : "whitespace-pre-wrap",
    className
  );

  if (markdown && typeof children === "string") {
    return (
      <div className={baseClasses} {...props}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Let the chat-prose CSS handle styling
            p({ children: pChildren, ...pProps }) {
              return <p {...pProps}>{pChildren}</p>;
            },
            code({ className: codeClassName, children: codeChildren, ...codeProps }) {
              const isInline = !codeClassName;
              return isInline ? (
                <code {...codeProps}>{codeChildren}</code>
              ) : (
                <code className={codeClassName} {...codeProps}>
                  {codeChildren}
                </code>
              );
            },
            pre({ children: preChildren, ...preProps }) {
              return <pre {...preProps}>{preChildren}</pre>;
            },
            a({ href, children: linkChildren, ...linkProps }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...linkProps}
                >
                  {linkChildren}
                </a>
              );
            },
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

// Message actions container
export type MessageActionsProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function MessageActions({ children, className, ...props }: MessageActionsProps) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
}

// Individual message action with tooltip
export type MessageActionProps = {
  children: React.ReactNode;
  tooltip: React.ReactNode;
  delayDuration?: number;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
};

function MessageAction({
  children,
  tooltip,
  delayDuration = 100,
  side = "top",
  className,
}: MessageActionProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { Message, MessageContent, MessageActions, MessageAction };

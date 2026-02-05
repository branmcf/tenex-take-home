"use client";

import * as React from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SourceProps {
  children: React.ReactNode;
  href?: string;
}

type SourceContextValue = {
  href?: string;
};

const SourceContext = React.createContext<SourceContextValue | null>(null);

function useSourceContext() {
  return React.useContext(SourceContext);
}

function Source({ children, href }: SourceProps) {
  return (
    <SourceContext.Provider value={{ href }}>
      <TooltipProvider>
        <Tooltip delayDuration={100}>{children}</Tooltip>
      </TooltipProvider>
    </SourceContext.Provider>
  );
}

interface SourceTriggerProps {
  label?: string;
  index?: number;
  showFavicon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function SourceTrigger({
  label,
  index,
  showFavicon = false,
  className,
  children,
}: SourceTriggerProps) {
  const context = useSourceContext();
  const href = context?.href;
  const hostname = React.useMemo(() => {
    if (!href) return undefined;
    try {
      return new URL(href).hostname.replace(/^www\./, "");
    } catch {
      return undefined;
    }
  }, [href]);

  const displayLabel = children ?? label ?? hostname ?? "Source";
  const faviconUrl =
    showFavicon && hostname
      ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
      : undefined;

  const trigger = href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 bg-secondary px-2 py-0.5 text-xs font-mono text-secondary-foreground transition-colors hover:bg-secondary/80 border border-border",
        className
      )}
    >
      {faviconUrl && (
        <Image
          src={faviconUrl}
          alt=""
          width={12}
          height={12}
          className="h-3 w-3"
          aria-hidden="true"
        />
      )}
      {index !== undefined && (
        <span className="text-muted-foreground">[{index}]</span>
      )}
      <span className="max-w-[150px] truncate">{displayLabel}</span>
    </a>
  ) : (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 bg-secondary px-2 py-0.5 text-xs font-mono text-secondary-foreground transition-colors hover:bg-secondary/80 border border-border",
        className
      )}
    >
      {faviconUrl && (
        <Image
          src={faviconUrl}
          alt=""
          width={12}
          height={12}
          className="h-3 w-3"
          aria-hidden="true"
        />
      )}
      {index !== undefined && (
        <span className="text-muted-foreground">[{index}]</span>
      )}
      <span className="max-w-[150px] truncate">{displayLabel}</span>
    </button>
  );

  return (
    <TooltipTrigger asChild>{trigger}</TooltipTrigger>
  );
}

interface SourceContentProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
}

function SourceContent({
  title,
  description,
  url,
  className,
}: SourceContentProps) {
  const context = useSourceContext();
  const displayUrl = url ?? context?.href;

  return (
    <TooltipContent
      side="top"
      className={cn("max-w-[300px] p-3", className)}
    >
      <div className="space-y-1">
        <p className="font-medium text-sm">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        {displayUrl && (
          <p className="text-xs text-muted-foreground truncate">
            {displayUrl}
          </p>
        )}
      </div>
    </TooltipContent>
  );
}

export { Source, SourceTrigger, SourceContent };

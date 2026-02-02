"use client";

import { ArrowDown } from "@phosphor-icons/react";
import { useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ScrollButtonProps {
  className?: string;
}

export function ScrollButton({ className }: ScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "h-8 w-8 border border-border",
        className
      )}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}

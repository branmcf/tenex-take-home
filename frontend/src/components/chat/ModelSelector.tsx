"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Model } from "./types";

const STORAGE_KEY = "b-plex:selected-model";

function groupModelsByProvider(models: Model[]): Map<string, Model[]> {
  const grouped = new Map<string, Model[]>();

  for (const model of models) {
    const existing = grouped.get(model.provider) || [];
    grouped.set(model.provider, [...existing, model]);
  }

  return grouped;
}

interface ModelSelectorProps {
  models: Model[];
  value: string;
  onChange: (modelId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ModelSelector({
  models,
  value,
  onChange,
  disabled,
  className,
}: ModelSelectorProps) {
  const groupedModels = React.useMemo(
    () => groupModelsByProvider(models),
    [models]
  );

  React.useEffect(() => {
    if (value && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value);
    }
  }, [value]);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("w-[140px] h-8 text-xs", className)}>
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {Array.from(groupedModels.entries()).map(
          ([provider, providerModels]) => (
            <SelectGroup key={provider}>
              <SelectLabel className="text-xs">{provider}</SelectLabel>
              {providerModels.map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-xs">
                  {model.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )
        )}
      </SelectContent>
    </Select>
  );
}

export function useModelSelection(models: Model[], defaultModelId?: string) {
  const [selectedModel, setSelectedModel] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && models.some((m) => m.id === stored)) {
        return stored;
      }
    }
    return defaultModelId || models[0]?.id || "";
  });

  return { selectedModel, setSelectedModel };
}

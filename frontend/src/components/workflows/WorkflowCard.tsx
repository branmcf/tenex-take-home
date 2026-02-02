"use client";

import * as React from "react";
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import type { WorkflowListItemData } from "./types";

interface WorkflowCardProps {
  workflow: WorkflowListItemData;
  isSelected?: boolean;
  onSelect: (workflowId: string) => void;
  onRename: (workflowId: string, newName: string) => void;
  onDelete: (workflowId: string) => void;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function WorkflowCard({
  workflow,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}: WorkflowCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(workflow.name);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(workflow.name);
    setIsEditing(true);
  }, [workflow.name]);

  const handleSaveEdit = React.useCallback(() => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== workflow.name) {
      onRename(workflow.id, trimmedName);
    }
    setIsEditing(false);
  }, [editName, workflow.id, workflow.name, onRename]);

  const handleCancelEdit = React.useCallback(() => {
    setEditName(workflow.name);
    setIsEditing(false);
  }, [workflow.name]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit]
  );

  const handleDeleteClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    onDelete(workflow.id);
    setShowDeleteDialog(false);
  }, [workflow.id, onDelete]);

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer transition-colors hover:bg-accent/50",
          isSelected && "border-primary bg-accent/30"
        )}
        onClick={() => onSelect(workflow.id)}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  ref={inputRef}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 text-sm font-semibold"
                />
              ) : (
                <CardTitle className="text-sm truncate">{workflow.name}</CardTitle>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                v{workflow.version}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DotsThreeVertical className="h-4 w-4" />
                    <span className="sr-only">Workflow options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleStartEdit}>
                    <PencilSimple className="h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="text-xs line-clamp-2 mb-2">
            {workflow.description}
          </CardDescription>
          <p className="text-xs text-muted-foreground">
            Edited {formatRelativeTime(workflow.lastEditedAt)}
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{workflow.name}&quot;? This action
              cannot be undone and will remove all versions of this workflow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useState } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Trash2, Edit } from "lucide-react";
import { ColumnId } from "@/components/common/kanban-board";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit?.(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(task.id as string);
  };

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleButtonPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }),
        "cursor-grab active:cursor-grabbing group relative"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex-1">{task.content}</span>
          {!isOverlay && !isDragging && isHovered && (
            <div 
              className="flex items-center gap-1" 
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleButtonMouseDown}
              onPointerDown={handleButtonPointerDown}
            >
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleEditClick}
                  onMouseDown={handleButtonMouseDown}
                  onPointerDown={handleButtonPointerDown}
                  className="h-6 w-6 opacity-70 hover:opacity-100"
                >
                  <Edit className="h-3 w-3" />
                  <span className="sr-only">Edit task</span>
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDeleteClick}
                  onMouseDown={handleButtonMouseDown}
                  onPointerDown={handleButtonPointerDown}
                  className="h-6 w-6 text-destructive opacity-70 hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Delete task</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


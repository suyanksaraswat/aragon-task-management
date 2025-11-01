"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnId } from ".";
import type { Task } from "./task-card";

// Helper function to map columnId to status
function columnIdToStatus(columnId: ColumnId): "todo" | "in_progress" | "done" {
  switch (columnId) {
    case "todo":
      return "todo";
    case "in-progress":
      return "in_progress";
    case "done":
      return "done";
  }
}

// Helper function to map status to columnId
function statusToColumnId(status: "todo" | "in_progress" | "done"): ColumnId {
  switch (status) {
    case "todo":
      return "todo";
    case "in_progress":
      return "in-progress";
    case "done":
      return "done";
  }
}

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, title: string, status: "todo" | "in_progress" | "done") => void;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSave,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<ColumnId>("todo");

  useEffect(() => {
    if (task) {
      setTitle(task.content);
      setStatus(task.columnId);
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !title.trim()) return;
    const taskId = typeof task.id === "string" ? task.id : String(task.id);
    onSave(taskId, title.trim(), columnIdToStatus(status));
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (task) {
      setTitle(task.content);
      setStatus(task.columnId);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the task title and status.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ColumnId)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
}

export function DeleteTaskDialog({
  task,
  open,
  onOpenChange,
  onDelete,
}: DeleteTaskDialogProps) {
  const handleDelete = () => {
    if (!task) return;
    const taskId = typeof task.id === "string" ? task.id : String(task.id);
    onDelete(taskId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{task?.content}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string, status: "todo" | "in_progress" | "done") => void;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<ColumnId>("todo");

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setTitle("");
      setStatus("todo");
    }
  }, [open]);

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), columnIdToStatus(status));
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle("");
    setStatus("todo");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your board. You can change its status later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-title">Title</Label>
            <Input
              id="create-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ColumnId)}>
              <SelectTrigger id="create-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


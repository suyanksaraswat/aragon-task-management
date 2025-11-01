import { ColumnId } from "@/components/common/kanban-board";

// Helper function to map columnId to status
export function columnIdToStatus(columnId: ColumnId): "todo" | "in_progress" | "done" {
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
export function statusToColumnId(status: "todo" | "in_progress" | "done"): ColumnId {
  switch (status) {
    case "todo":
      return "todo";
    case "in_progress":
      return "in-progress";
    case "done":
      return "done";
  }
}


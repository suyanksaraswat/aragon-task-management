"use client";

import { DragAndDropProvider } from "@/components/ui/drag-and-drop";
import { KanbanBoard } from "./kanban-board";

export function KanbanBoardComponent() {
  return (
    <DragAndDropProvider>
      <KanbanBoard />
    </DragAndDropProvider>
  );
}

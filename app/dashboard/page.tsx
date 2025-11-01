import { KanbanBoard } from "@/components/common/kanban-board";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Aragon Task Management",
  description: "Manage your tasks from your personalized dashboard.",
  keywords: ["dashboard", "task management", "tasks"],
};

export default function Page() {
  return (
    <div className="py-4 overflow-auto">
      <KanbanBoard />
    </div>
  );
}

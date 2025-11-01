"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./board-column";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { type Task, TaskCard } from "@/components/common/task";
import type { Column } from "./board-column";
import { hasDraggableData } from "./hasDraggableData";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { trpc } from "@/app/_trpc/client";
import { EditTaskDialog, DeleteTaskDialog, CreateTaskDialog } from "@/components/common/task";
import { useTaskContext } from "@/contexts/task-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Helper functions to map between database status and columnId
function statusToColumnId(status: "todo" | "in_progress" | "done"): ColumnId {
  switch (status) {
    case "todo":
      return "todo";
    case "in_progress":
      return "in-progress";
    case "done":
      return "done";
    default:
      return "todo";
  }
}

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

const defaultCols = [
  {
    id: "todo" as const,
    title: "Todo",
  },
  {
    id: "in-progress" as const,
    title: "In progress",
  },
  {
    id: "done" as const,
    title: "Done",
  },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]["id"];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // Fetch tasks from tRPC
  const { data: dbTasks, isLoading, refetch } = trpc.tasks.getKanbanTasks.useQuery();
  const updateTaskMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteTaskMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const createTaskMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Get create dialog state from context
  const { isCreateDialogOpen, closeCreateDialog, openCreateDialog } = useTaskContext();

  // Map database tasks to kanban Task format
  const mappedTasks = useMemo(() => {
    if (!dbTasks) return [];
    return dbTasks.map((dbTask) => ({
      id: dbTask.id,
      columnId: statusToColumnId(dbTask.status as "todo" | "in_progress" | "done"),
      content: dbTask.title,
    }));
  }, [dbTasks]);

  // Use state for tasks to enable optimistic updates during drag
  const [tasks, setTasks] = useState<Task[]>([]);

  // Sync tasks with fetched data
  useEffect(() => {
    if (dbTasks) {
      setTasks(mappedTasks);
    }
  }, [dbTasks, mappedTasks]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Handlers for edit and delete
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setDeleteDialogOpen(true);
    }
  };

  const handleSaveTask = (
    id: string,
    title: string,
    status: "todo" | "in_progress" | "done"
  ) => {
    updateTaskMutation.mutate({
      id,
      title,
      status,
    });
  };

  const handleConfirmDelete = (id: string) => {
    deleteTaskMutation.mutate({ id });
  };

  const handleCreateTask = (title: string, status: "todo" | "in_progress" | "done") => {
    createTaskMutation.mutate({
      title,
      status,
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Require 250ms hold before drag starts on touch
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${
          active.data.current.task.content
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.content
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  // Show empty state when there are no tasks
  if (!isLoading && tasks.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] gap-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              No tasks yet
            </h2>
            <p className="text-muted-foreground max-w-md">
              Start by adding your first task to get organized and stay productive.
            </p>
          </div>
          <Button onClick={openCreateDialog} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Your First Task
          </Button>
        </div>

        {/* Create Task Dialog */}
        <CreateTaskDialog
          open={isCreateDialogOpen}
          onOpenChange={closeCreateDialog}
          onCreate={handleCreateTask}
        />
      </>
    );
  }

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </SortableContext>
      </BoardContainer>

      {typeof window !== "undefined" &&
        typeof document !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={selectedTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveTask}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTaskDialog
        task={selectedTask}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleConfirmDelete}
      />

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={closeCreateDialog}
        onCreate={handleCreateTask}
      />
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          // Update status in database
          const newStatus = columnIdToStatus(overTask.columnId);
          updateTaskMutation.mutate({
            id: activeId as string,
            status: newStatus,
          });
          // Create new task with updated columnId
          const updatedTasks = [...tasks];
          updatedTasks[activeIndex] = { ...activeTask, columnId: overTask.columnId };
          return arrayMove(updatedTasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        const newColumnId = overId as ColumnId;
        if (activeTask && activeTask.columnId !== newColumnId) {
          // Update status in database
          const newStatus = columnIdToStatus(newColumnId);
          updateTaskMutation.mutate({
            id: activeId as string,
            status: newStatus,
          });
          // Create new task with updated columnId
          const updatedTasks = [...tasks];
          updatedTasks[activeIndex] = { ...activeTask, columnId: newColumnId };
          return arrayMove(updatedTasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }
}

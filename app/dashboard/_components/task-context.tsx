"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface TaskContextType {
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  isCreateDialogOpen: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const closeCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        openCreateDialog,
        closeCreateDialog,
        isCreateDialogOpen,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (context === undefined) {
    // Return a no-op implementation when context is not available
    return {
      openCreateDialog: () => {},
      closeCreateDialog: () => {},
      isCreateDialogOpen: false,
    };
  }
  return context;
}


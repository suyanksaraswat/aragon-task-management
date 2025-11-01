import type { Metadata } from "next";
import CreateTaskForm from "./_components/create-task-form";

export const metadata: Metadata = {
  title: "Create New Task - Aragon Task Management",
  description: "Create a new task with detailed requirements, skills, and other information.",
  keywords: ["create task", "task management", "tasks"],
};

export default function Page() {
  return (
    <div className="py-8">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Task
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill out the form below to create a new task.
          </p>
        </div>
        <CreateTaskForm />
      </div>
    </div>
  );
}

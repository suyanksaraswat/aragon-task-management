import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Aragon Task Management",
  description: "Manage your tasks from your personalized dashboard.",
  keywords: ["dashboard", "task management", "tasks"],
};

export default function Page() {
  return (
    <div className="py-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Aragon Task Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your tasks and stay organized.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Create Task
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage your tasks.
            </p>
            <Button>qweq</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

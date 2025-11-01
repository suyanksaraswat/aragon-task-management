import { router } from "../trpc";
import { taskRouter } from "./tasks";

// Combine your individual routers into a single 'appRouter'
export const appRouter = router({
  tasks: taskRouter,
});

// Export the *entire* router's type for the client
export type AppRouter = typeof appRouter;

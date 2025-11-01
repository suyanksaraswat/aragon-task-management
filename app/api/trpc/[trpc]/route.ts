import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "@/app/server/context";
import { appRouter } from "@/app/server/routers/app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };

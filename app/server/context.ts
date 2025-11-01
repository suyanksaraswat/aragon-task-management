import { auth } from "@/lib/auth";

export const createContext = async () => {
  const session = await auth();
  return {
    auth: {
      userId: session?.user?.id || null,
      user: session?.user || null,
    },
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const createContext = async () => {
  const session = await getServerSession(authOptions);
  return {
    auth: {
      userId: session?.user?.id || null,
      user: session?.user || null,
    },
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

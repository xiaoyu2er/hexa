"use client";

import type { validateRequest } from "@/lib/auth";
import { $getUserInfo } from "@/server/client";
import { useQuery } from "@tanstack/react-query";
import type { User } from "lucia";
import { type ReactNode, createContext, useContext } from "react";

type SessionContextType = Awaited<ReturnType<typeof validateRequest>>;
export const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
});

export const SessionProvider: React.FC<
  SessionContextType & { children: ReactNode }
> = ({ children, ...props }) => {
  return (
    <SessionContext.Provider value={props}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const { user, session } = useContext(SessionContext);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["user/info"],
    queryFn: $getUserInfo,
    initialData: user,
  });
  return { user: data as User, session, refetch };
};

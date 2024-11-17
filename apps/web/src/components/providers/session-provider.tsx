'use client';

import { $getUserInfo } from '@/lib/api';
import type { getSession } from '@/lib/session';
import { useQuery } from '@tanstack/react-query';
import type { User } from 'lucia';
import { type FC, type ReactNode, createContext, useContext } from 'react';

type SessionContextType = Awaited<ReturnType<typeof getSession>>;
export const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
});

export const SessionProvider: FC<
  SessionContextType & { children: ReactNode }
> = ({ children, ...props }) => {
  return (
    <SessionContext.Provider value={props}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const { user, session } = useContext(SessionContext);
  const { data, refetch } = useQuery({
    queryKey: ['user/info'],
    queryFn: $getUserInfo,
    initialData: user,
  });
  return { user: data as User, session, refetch };
};

'use client';
import type { getSession } from '@hexa/server/session';
import { createContext } from 'react';
import type { FC, ReactNode } from 'react';

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

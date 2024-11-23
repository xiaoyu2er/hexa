import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { SessionContext } from '@/components/providers/session-provider';
import { queryUserOptions } from '@/lib/queries/user';
import type { User } from 'lucia';

export const useUser = () => {
  const { user } = useContext(SessionContext);
  const { data, refetch } = useQuery({
    ...queryUserOptions,
  });
  return { user: (data || user) as User & { email: string }, refetch };
};

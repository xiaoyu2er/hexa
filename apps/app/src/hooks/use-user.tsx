import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

import { queryUserOptions } from '@/lib/queries/user';
import { SessionContext } from '@hexa/ui/session-provider';
import type { User } from 'lucia';

export const useUser = () => {
  const { user } = useContext(SessionContext);
  const { data, refetch } = useQuery({
    ...queryUserOptions,
  });
  return {
    user: (data || user) as User & { email: string },
    refetch,
    invalidate: refetch,
  };
};

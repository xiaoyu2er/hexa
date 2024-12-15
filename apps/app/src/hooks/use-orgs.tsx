import { queryOrgsOptions } from '@/lib/queries/orgs';
import type { TableQuery } from '@/lib/queries/table';
import { useQuery } from '@tanstack/react-query';
import type {} from '@tanstack/react-table';

export const useOrgs = (query?: TableQuery) => {
  const { data, isFetching, refetch } = useQuery(queryOrgsOptions(query));

  return { data, isFetching, refetch };
};

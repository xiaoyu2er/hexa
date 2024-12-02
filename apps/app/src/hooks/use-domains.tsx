import { useProject } from '@/hooks/use-project';
import { queryDomainsOptions } from '@/lib/queries/orgs';
import type { TableQuery } from '@/lib/queries/table';
import { useQuery } from '@tanstack/react-query';
import type {} from '@tanstack/react-table';

export const useDomains = (query: TableQuery) => {
  const {
    project: { org },
  } = useProject();

  const { data, isFetching, refetch } = useQuery(
    queryDomainsOptions(org.id, query)
  );

  return { data, isFetching, refetch };
};

import { useProject } from '@/hooks/use-project';
import { queryOrgInvitesOptions } from '@/lib/queries/orgs';
import type { TableQuery } from '@/lib/queries/table';
import { useQuery } from '@tanstack/react-query';
import type {} from '@tanstack/react-table';

export const useInvites = (query: TableQuery) => {
  const {
    project: { org },
  } = useProject();

  const { data, isFetching, refetch } = useQuery(
    queryOrgInvitesOptions(org.id, query)
  );

  return { data, isFetching, refetch };
};

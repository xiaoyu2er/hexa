import { useProject } from '@/hooks/use-project';
import { queryOrgMembersOptions } from '@/lib/queries/orgs';
import type { TableQuery } from '@/lib/queries/orgs';
import { useQuery } from '@tanstack/react-query';
import type {} from '@tanstack/react-table';

export const useMembers = (query: TableQuery) => {
  const {
    project: { org },
  } = useProject();

  const { data, isFetching, refetch } = useQuery(
    queryOrgMembersOptions(org.id, query)
  );

  return { data, isFetching, refetch };
};

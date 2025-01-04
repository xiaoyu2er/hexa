import { useProject } from '@/hooks/use-project';
import { queryOrgMembersOptions } from '@/lib/queries/orgs';
import { queryTagsOptions } from '@/lib/queries/project';
import type { TableQuery } from '@/lib/queries/table';

import { useQuery } from '@tanstack/react-query';
import type {} from '@tanstack/react-table';

export const useTags = (query: TableQuery) => {
  const {
    project,
  } = useProject();

  const { data, isFetching, refetch } = useQuery(
    queryTagsOptions(project.id, query)
  );

  return { data, isFetching, refetch };
};

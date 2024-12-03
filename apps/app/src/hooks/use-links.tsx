import { useProject } from '@/hooks/use-project';
import { queryLinksOptions } from '@/lib/queries/project';
import type { TableQuery } from '@/lib/queries/table';
import { useQuery } from '@tanstack/react-query';

export const useLinks = (query: TableQuery) => {
  const { project } = useProject();

  const { data, isFetching, refetch } = useQuery(
    queryLinksOptions(project.id, query)
  );

  return { data, isFetching, refetch };
};

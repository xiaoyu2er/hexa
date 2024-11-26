import { useProject } from '@/hooks/use-project';
import { queryUrlsOptions } from '@/lib/queries/project';
import type { TableQuery } from '@/lib/queries/table';
import { useQuery } from '@tanstack/react-query';

export const useUrls = (query: TableQuery) => {
  const { project } = useProject();

  const { data, isFetching, refetch } = useQuery(
    queryUrlsOptions(project.id, query)
  );

  return { data, isFetching, refetch };
};

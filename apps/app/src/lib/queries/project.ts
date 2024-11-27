'use client';

import { getQueryClient } from '@/components/providers/get-query-client';
import { $getAccessibleProjects, $getProject, $getUrls } from '@/lib/api';
import { type TableQuery, getTableQuery } from '@/lib/queries/table';
import { queryOptions } from '@tanstack/react-query';

export const queryProjectsOptions = queryOptions({
  queryKey: ['projects'],
  queryFn: () => $getAccessibleProjects({}),
  staleTime: Number.POSITIVE_INFINITY,
});

export const invalidateProjectsQuery = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['projects'],
  });
};

export const queryProjectOptions = (projectId: string) =>
  queryOptions({
    queryKey: ['project/', projectId],
    queryFn: () => $getProject({ param: { projectId } }),

    staleTime: Number.POSITIVE_INFINITY,
  });

export const invalidateProject = (projectId: string) => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['project/', projectId],
  });
};

export const queryUrlsOptions = (projectId: string, query: TableQuery) =>
  queryOptions({
    queryKey: ['project/', projectId, 'urls', query],
    queryFn: () =>
      $getUrls({
        param: { projectId },
        query: getTableQuery(query),
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const invalidateUrls = (projectId: string, query?: TableQuery) => {
  return getQueryClient().invalidateQueries({
    queryKey: query
      ? ['project/', projectId, 'urls', query]
      : ['project/', projectId, 'urls'],
  });
};
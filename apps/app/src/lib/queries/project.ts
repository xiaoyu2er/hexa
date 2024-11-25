'use client';

import { getQueryClient } from '@/components/providers/get-query-client';
import { $getAccessibleProjects, $getProject } from '@/lib/api';
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

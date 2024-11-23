'use client';

import { getQueryClient } from '@/components/providers/get-query-client';
import { $getAccessibleProjects, $getProject } from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';

export const queryProjectsOptions = queryOptions({
  queryKey: ['projects'],
  queryFn: () => $getAccessibleProjects({}),
});

export const invalidateProjectsQuery = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['projects'],
  });
};

export const queryProjectOptions = (projectId: string | undefined) =>
  queryOptions({
    queryKey: ['project/', projectId],
    queryFn: () => $getProject({ param: { projectId: projectId ?? '' } }),
    enabled: !!projectId,
  });

export const invalidateProject = (projectId: string) => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['project/', projectId],
  });
};

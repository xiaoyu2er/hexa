'use client';

import { type TableQuery, getTableQuery } from '@/lib/queries/table';
import {
  $getAccessibleProjects,
  $getLinks,
  $getProject,
  $getTags,
} from '@hexa/server/api';
import { getQueryClient } from '@hexa/ui/get-query-client';
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

export const queryLinksOptions = (projectId: string, query: TableQuery) =>
  queryOptions({
    queryKey: ['project/', projectId, 'urls', query],
    queryFn: () =>
      $getLinks({
        param: { projectId },
        query: getTableQuery(query),
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
export const queryTagsOptions = (projectId: string, query: TableQuery) =>
  queryOptions({
    queryKey: ['project/', projectId, 'tags', query],
    queryFn: () =>
      $getTags({
        param: { projectId },
        query: getTableQuery(query),
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
export const invalidateProjectLinks = (
  projectId: string,
  query?: TableQuery
) => {
  return getQueryClient().invalidateQueries({
    queryKey: query
      ? ['project/', projectId, 'urls', query]
      : ['project/', projectId, 'urls'],
  });
};
export const invalidateProjectTags = (
  projectId: string,
  query?: TableQuery
) => {
  return getQueryClient().invalidateQueries({
    queryKey: query
      ? ['project/', projectId, 'tags', query]
      : ['project/', projectId, 'tags'],
  });
};
export const invalidateAnalytics = (projectId: string) => {
  return getQueryClient().invalidateQueries({
    queryKey: ['project', projectId, 'analytics'],
  });
};

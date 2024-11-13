import { getQueryClient } from '@/components/providers/get-query-client';
import { $getWorkspaceBySlug, $getWorkspaces } from '@/server/client';
import { queryOptions } from '@tanstack/react-query';

export const queryWorkspacesOptions = queryOptions({
  queryKey: ['workspaces'],
  queryFn: $getWorkspaces,
});

export const invalidateWorkspacesQuery = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['workspaces'],
  });
};

export const queryWorkspaceBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: ['workspace/slug/', slug],
    queryFn: () => $getWorkspaceBySlug({ param: { slug } }),
  });

export const invalidateWorkspaceBySlugQuery = (slug: string) => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['workspace/slug/', slug],
  });
};

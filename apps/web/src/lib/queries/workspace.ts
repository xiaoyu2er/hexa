import { getQueryClient } from '@/components/providers/get-query-client';
import {
  $getAccessibleWorkspaces,
  $getOwnerWorkspaces,
  $getWorkspaceBySlug,
} from '@/lib/api';
import { queryOptions } from '@tanstack/react-query';

export const queryWorkspacesOptions = (ownerName?: string) =>
  queryOptions({
    queryKey: ['workspaces/', ownerName],
    queryFn: () =>
      ownerName
        ? $getOwnerWorkspaces({ param: { owner: ownerName } })
        : $getAccessibleWorkspaces({}),
  });

export const invalidateWorkspacesQuery = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['workspaces'],
  });
};

export const queryWorkspaceBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: ['workspace/', slug],
    queryFn: () => $getWorkspaceBySlug({ query: { slug } }),
  });

export const invalidateWorkspaceBySlugQuery = (slug: string) => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ['workspace/slug/', slug],
  });
};

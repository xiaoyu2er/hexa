import {
  getWorkspaceBySlugAction,
  getWorkspacesAction,
} from "@/lib/actions/workspace";
import { getQueryClient } from "@/providers/get-query-client";
import { queryOptions } from "@tanstack/react-query";

export const queryWorkspacesOptions = queryOptions({
  queryKey: ["workspaces"],
  queryFn: async () => {
    const [res, err] = await getWorkspacesAction();
    if (err) {
      throw err;
    }

    return res.workspaces ?? [];
  },
});

export const invalidateWorkspacesQuery = () => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ["workspaces"],
  });
};

export const queryWorkspaceBySlugOptions = (slug: string) =>
  queryOptions({
    queryKey: ["workspace/slug/", slug],
    queryFn: async () => {
      const [res, err] = await getWorkspaceBySlugAction({ slug });
      if (err) {
        throw err;
      }

      return res.workspace;
    },
  });

export const invalidateWorkspaceBySlugQuery = (slug: string) => {
  const client = getQueryClient();
  client.invalidateQueries({
    queryKey: ["workspace/slug/", slug],
  });
};

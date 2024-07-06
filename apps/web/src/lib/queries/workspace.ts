import { queryOptions } from "@tanstack/react-query";
import {
  getWorkspaceBySlugAction,
  getWorkspacesAction,
} from "@/lib/actions/workspace";

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

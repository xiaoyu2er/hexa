"use client";

import NoWorkspaces from "./no-workspaces";
import { WorkspaceCard } from "./workspace-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryWorkspacesOptions } from "@/lib/queries/workspace";

export const WorkspaceList = () => {
  const { data: workspaces } = useSuspenseQuery(queryWorkspacesOptions);
  return (
    <>
      {workspaces.length > 0 ? (
        <div className="flex gap-5 flex-wrap">
          {workspaces.map((w) => {
            return <WorkspaceCard key={w.id} workspace={w}></WorkspaceCard>;
          })}
        </div>
      ) : (
        <NoWorkspaces />
      )}
    </>
  );
};

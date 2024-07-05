"use server";

import { validateRequest } from "@/lib/auth";
import { getWorkspacesByUserId } from "@/lib/db/data-access/workspace";
import NoWorkspaces from "./no-workspaces";
import { WorkspaceCard } from "./workspace-card";

export const WorkspaceList = async () => {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const list = await getWorkspacesByUserId(user.id);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <>
      {list.length > 0 ? (
        <div className="flex gap-5 flex-wrap">
          {list.map((w) => {
            return <WorkspaceCard key={w.id} workspace={w}></WorkspaceCard>;
          })}
        </div>
      ) : (
        <NoWorkspaces />
      )}
    </>
  );
};

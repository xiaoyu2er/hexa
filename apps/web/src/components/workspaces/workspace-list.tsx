'use client';

import { queryWorkspacesOptions } from '@/lib/queries/workspace';
import { useSuspenseQuery } from '@tanstack/react-query';
import NoWorkspaces from './no-workspaces';
import { WorkspaceCard } from './workspace-card';

export const WorkspaceList = () => {
  const { data: workspaces } = useSuspenseQuery(queryWorkspacesOptions);
  return (
    <>
      {workspaces.length > 0 ? (
        <div className="flex flex-wrap gap-5">
          {workspaces.map((w) => {
            return <WorkspaceCard key={w.id} workspace={w} />;
          })}
        </div>
      ) : (
        <NoWorkspaces />
      )}
    </>
  );
};

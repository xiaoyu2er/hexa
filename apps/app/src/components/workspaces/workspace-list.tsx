'use client';

import { queryWorkspacesOptions } from '@/lib/queries/workspace';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import NoWorkspaces from './no-workspaces';
import { WorkspaceCard } from './workspace-card';

export const WorkspaceList = () => {
  const { owner } = useParams() as { owner: string };
  const { data: workspaces } = useSuspenseQuery(queryWorkspacesOptions(owner));

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
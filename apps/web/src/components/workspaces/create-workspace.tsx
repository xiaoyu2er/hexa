'use client';

import { queryWorkspacesOptions } from '@/lib/queries/workspace';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CreateWorkspaceModal } from './create-workspace-modal';

export function CreateWorkspace() {
  const modal = useModal(CreateWorkspaceModal);
  const { refetch } = useSuspenseQuery(queryWorkspacesOptions);
  return (
    <Button
      onClick={() => {
        modal.show().then(() => {
          refetch();
        });
      }}
    >
      Create Workspace
    </Button>
  );
}

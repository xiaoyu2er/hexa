'use client';

import { invalidateWorkspacesQuery } from '@/lib/queries/workspace';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { CreateWorkspaceModal } from './create-workspace-modal';

export function CreateWorkspace() {
  const modal = useModal(CreateWorkspaceModal);

  return (
    <Button
      onClick={() => {
        modal.show().then(() => {
          invalidateWorkspacesQuery();
        });
      }}
    >
      Create Workspace
    </Button>
  );
}

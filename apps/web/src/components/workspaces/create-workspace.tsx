'use client';

import { Button } from '@hexa/ui/button';
import { CreateWorkspaceModal } from './create-workspace-modal';

export function CreateWorkspace() {
  return (
    <CreateWorkspaceModal>
      <Button>Create Workspace</Button>
    </CreateWorkspaceModal>
  );
}

'use client';

import { invalidateProjectsQuery } from '@/lib/queries/workspace';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { CreateProjectModal } from './create-project-modal';

export function CreateProject() {
  const modal = useModal(CreateProjectModal);

  return (
    <Button
      onClick={() => {
        modal.show().then(() => {
          invalidateProjectsQuery();
        });
      }}
    >
      Create Project
    </Button>
  );
}
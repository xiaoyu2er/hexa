'use client';

import { invalidateProjectsQuery } from '@/lib/queries/project';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@nextui-org/react';
import { CreateProjectModal } from './create-project-modal';

export function CreateProject() {
  const modal = useModal(CreateProjectModal);

  return (
    <Button
      color="primary"
      onPress={() => {
        modal.show().then(() => {
          invalidateProjectsQuery();
        });
      }}
    >
      Create Project
    </Button>
  );
}

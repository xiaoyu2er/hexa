'use client';

import { useCreateProject } from '@/hooks/use-create-project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import type { SelectOrgType } from '@hexa/server/schema/org';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { CreateProjectForm } from './create-project-form';

export const CreateProjectModal = NiceModal.create((org: SelectOrgType) => {
  const modal = useModal();
  const router = useRouter();
  const { form, onSubmit } = useCreateProject({
    org,
    onSuccess: (project) => {
      modal.resolve();
      modal.remove();
      router.push(`/${org.slug}/${project.slug}`);
    },
  });

  return (
    <Modal isOpen={modal.visible} backdrop="blur" onOpenChange={modal.remove}>
      <ModalContent>
        <ModalHeader>Create Project</ModalHeader>
        <ModalBody>
          <CreateProjectForm
            form={form}
            onSubmit={onSubmit}
            buttonProps={{ size: 'md' }}
            org={org}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

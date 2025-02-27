'use client';

import { useCreateOrg } from '@/hooks/use-create-org';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { CreateOrgForm } from './create-org-form';

export const CreateOrgModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();

  const { form, onSubmit } = useCreateOrg({
    onSuccess: (projectId) => {
      modal.resolve();
      modal.remove();
      router.push(`/${projectId}`);
    },
  });

  return (
    <Modal isOpen={modal.visible} onOpenChange={modal.remove}>
      <ModalContent className="p-4">
        <ModalHeader>Create Organization</ModalHeader>
        <ModalBody>
          <CreateOrgForm
            form={form}
            onSubmit={onSubmit}
            buttonProps={{ size: 'md' }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

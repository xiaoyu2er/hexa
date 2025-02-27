'use client';

import { InviteForm } from '@/components/org/invite/invite-form';
import { getRoleOptions, useInviteForm } from '@/hooks/use-invite-form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import type { SelectProjectType } from '@hexa/server/schema/project';

export const CreateInvitesModal = NiceModal.create(
  (project: SelectProjectType) => {
    const modal = useModal();

    const { form, onSubmit } = useInviteForm({
      orgId: project.org.id,
      onSuccess: () => {
        modal.resolve();
        modal.remove();
      },
      onError: (err) => {
        modal.reject(err);
      },
    });

    return (
      <Modal
        isOpen={modal.visible}
        onOpenChange={() => modal.remove()}
        size="md"
      >
        <ModalContent>
          <ModalHeader>Invite Members</ModalHeader>
          <ModalBody>
            <InviteForm
              form={form}
              onSubmit={onSubmit}
              roleOptions={getRoleOptions(project.role)}
              submitText="Invite members"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

'use client';

import { InviteForm } from '@/components/orgs/invite/invite-form';
import { getRoleOptions, useInviteForm } from '@/hooks/use-invite-form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import type { SelectProjectType } from '@hexa/server/schema/project';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

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
      <Modal isOpen={modal.visible} onOpenChange={() => modal.hide()} size="md">
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

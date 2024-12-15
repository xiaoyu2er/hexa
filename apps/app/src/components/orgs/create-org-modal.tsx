'use client';

import { setFormError } from '@/components/form';
import { $createOrg } from '@/lib/api';
import { invalidateProjectsQuery } from '@/lib/queries/project';

import { Form } from '@/components/form';
import { FormErrorMessage } from '@/components/form';
import { InsertOrgSchema, type InsertOrgType } from '@/server/schema/org';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { InputField } from '../form/input-field';

export const CreateOrgModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();
  const form = useForm<InsertOrgType>({
    resolver: zodResolver(InsertOrgSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: createOrg } = useMutation({
    mutationFn: $createOrg,
    onError: (err) => {
      setFormError(err, setError);
      modal.reject(err);
    },
    onSuccess: (project) => {
      toast.success('Organization created successfully');
      modal.resolve();
      modal.remove();
      router.push(`/${project.id}`);
      invalidateProjectsQuery();
    },
  });

  return (
    <Modal isOpen={modal.visible} onOpenChange={modal.hide}>
      <ModalContent className="p-4">
        <ModalHeader>Create Organization</ModalHeader>

        <Form
          form={form}
          onSubmit={handleSubmit((json) => createOrg({ json }))}
        >
          <ModalBody>
            <InputField
              form={form}
              name="name"
              label="Organization name"
              placeholder="Acme Inc."
            />

            <InputField
              form={form}
              name="desc"
              label="Organization Description"
              placeholder="A description of the organization"
            />

            <FormErrorMessage message={errors.root?.message} />
          </ModalBody>

          <ModalFooter>
            <Button
              className="w-full"
              type="submit"
              isLoading={isSubmitting}
              color="primary"
            >
              Create Organization
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
});

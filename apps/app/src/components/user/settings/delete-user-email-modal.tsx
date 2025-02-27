'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';

import { Form, InputField, setFormError } from '@/components/form';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { $deleteUserEmail } from '@hexa/server/api';
import {
  DeleteEmailSchema,
  type DeleteEmailType,
} from '@hexa/server/schema/email';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

interface DeleteUserEmailProps {
  email: string;
}
export const DeleteUserEmailModal = NiceModal.create(
  ({ email }: DeleteUserEmailProps) => {
    const modal = useModal();

    const form = useForm<DeleteEmailType>({
      resolver: zodResolver(DeleteEmailSchema),
      defaultValues: {
        email: '',
      },
    });

    const {
      handleSubmit,
      setError,
      formState: { isSubmitting, errors },
    } = form;

    const { mutateAsync: deleteUserEmail } = useMutation({
      mutationFn: $deleteUserEmail,
      onError: (err) => {
        setFormError(err, setError, 'email');
        modal.reject(err);
      },
      onSuccess: () => {
        toast.success('Email deleted successfully');
        modal.resolve();
        modal.remove();
      },
    });

    return (
      <Modal isOpen={modal.visible} onOpenChange={modal.remove} backdrop="blur">
        <ModalContent>
          <ModalHeader>Delete Email</ModalHeader>
          <Form
            form={form}
            onSubmit={handleSubmit((json) => deleteUserEmail({ json }))}
          >
            <ModalBody>
              <Alert
                description={`Warning: Permanently delete your email: ${email}, and their respective stats. This action cannot be undone - please proceed with caution.`}
                color="danger"
              />
              <InputField
                form={form}
                name="email"
                label={
                  <>
                    To verify, type&nbsp;
                    <span className="font-bold">{email}</span>&nbsp;below
                  </>
                }
              />
            </ModalBody>

            <ModalFooter>
              <Button
                color="danger"
                className="w-full"
                type="submit"
                isLoading={isSubmitting}
              >
                Delete Email
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    );
  }
);

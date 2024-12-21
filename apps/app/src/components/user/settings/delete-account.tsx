'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import { setFormError } from '@/components/form';
import { Form } from '@/components/form';
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { $deleteUser } from '@hexa/server/api';
import {
  DELETE_USER_CONFIRMATION,
  DeleteUserSchema,
  type DeleteUserType,
} from '@hexa/server/schema/user';

import { InputField } from '@/components/form';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function DeleteAccount() {
  const modal = useModal(DeleteAccountModal);
  return (
    <Card className="border border-danger-500">
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>
          Permanently delete your {NEXT_PUBLIC_APP_NAME} account, and their
          respective stats. This action cannot be undone - please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="border-danger-500">
        <Button
          color="danger"
          className="shrink-0"
          onPress={() => modal.show()}
        >
          Delete account
        </Button>
      </CardFooter>
    </Card>
  );
}

export const DeleteAccountModal = NiceModal.create(() => {
  const modal = useModal();
  const form = useForm<DeleteUserType>({
    resolver: zodResolver(DeleteUserSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: $deleteUser,
    onError: (err) => {
      setFormError(err, setError, 'confirm');
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
    },
  });

  return (
    <Modal isOpen={modal.visible} onOpenChange={modal.hide} backdrop="blur">
      <ModalContent>
        <ModalHeader>Delete account</ModalHeader>
        <Form
          form={form}
          onSubmit={handleSubmit((json) => deleteUser({ json }))}
        >
          <ModalBody>
            <Alert
              color="danger"
              description={`Warning: Permanently delete your ${NEXT_PUBLIC_APP_NAME} account, and their respective stats. This action cannot be undone - please proceed with caution.`}
            />
            <InputField
              form={form}
              name="confirm"
              label={
                <>
                  To verify, type
                  <span className="px-1 font-bold">
                    {DELETE_USER_CONFIRMATION}
                  </span>
                  below
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
              {DELETE_USER_CONFIRMATION}
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
});

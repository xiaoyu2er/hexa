'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';

import { Form, InputField, setFormError } from '@/components/form';
import { $deleteUserOauthAccount } from '@/lib/api';
import type { ProviderType } from '@/server/schema/oauth';
import {
  type DeleteOauthAccountInput,
  DeleteOauthAccountSchema,
} from '@/server/schema/oauth';
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

interface DeleteOauthAccountProps {
  provider: ProviderType;
}
export const DeleteOauthAccountModal = NiceModal.create(
  ({ provider }: DeleteOauthAccountProps) => {
    const modal = useModal();

    const form = useForm<DeleteOauthAccountInput>({
      resolver: zodResolver(DeleteOauthAccountSchema),
      defaultValues: {
        provider: undefined,
      },
    });

    const {
      handleSubmit,
      setError,
      formState: { isSubmitting, errors },
    } = form;

    const { mutateAsync: deleteUserOauthAccount } = useMutation({
      mutationFn: $deleteUserOauthAccount,
      onError: (err) => {
        setFormError(err, setError, 'provider');
        modal.reject(err);
      },
      onSuccess: () => {
        toast.success(`Your ${provider} account has been removed.`);
        modal.resolve();
        modal.remove();
      },
    });

    return (
      <Modal isOpen={modal.visible} onOpenChange={modal.hide} backdrop="blur">
        <ModalContent className="sm:max-w-[425px]">
          <ModalHeader>Delete Connected Account</ModalHeader>
          <Form
            form={form}
            onSubmit={handleSubmit((json) => deleteUserOauthAccount({ json }))}
          >
            <ModalBody>
              <Alert
                description={`Warning: This will remove your ${provider} account from your profile.`}
                color="danger"
              />
              <InputField
                form={form}
                name="provider"
                label={
                  <>
                    To verify, type&nbsp;
                    <span className="font-bold">{provider}</span>&nbsp;below
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
                Delete Connected Account
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    );
  }
);

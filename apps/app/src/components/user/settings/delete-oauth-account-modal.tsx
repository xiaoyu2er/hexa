'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';

import { setFormError } from '@/components/form';
import { $deleteUserOauthAccount } from '@/lib/api';
import {
  type DeleteOauthAccountInput,
  DeleteOauthAccountSchema,
} from '@/server/schema/oauth';
import type { ProviderType } from '@/server/schema/oauth';
import { Button } from '@hexa/ui/button';
import { Form } from '@hexa/ui/form';

import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';

import { Dialog } from '@/components/dialog';
import { InputField } from '@/components/form/input-field';
import { zodResolver } from '@hookform/resolvers/zod';
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
      <Dialog control={modal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Connected Account</DialogTitle>
            <DialogDescription>
              Warning: This will remove your {provider} account from your
              profile.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) =>
                deleteUserOauthAccount({ json })
              )}
              method="POST"
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
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
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="destructive"
                  className="w-full"
                  type="submit"
                  loading={isSubmitting}
                >
                  Delete Connected Account
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

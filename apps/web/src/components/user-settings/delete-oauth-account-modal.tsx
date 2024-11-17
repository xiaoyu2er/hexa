'use client';

import { Input } from '@hexa/ui/input';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';

import { setFormError } from '@/lib/form';
import { $deleteUserOauthAccount } from '@/server/client';
import {
  type DeleteOauthAccountInput,
  DeleteOauthAccountSchema,
} from '@/server/db/schema';
import type { ProviderType } from '@/server/db/schema';
import { Button } from '@hexa/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';

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
      <Dialog
        open={modal.visible}
        onOpenChange={(v: boolean) => {
          if (!v) {
            modal.resolveHide();
          }
          !v && !modal.keepMounted && modal.remove();
        }}
      >
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
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        To verify, type&nbsp;
                        <span className="font-bold">{provider}</span>&nbsp;below
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={
                            errors.provider ? 'border-destructive' : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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

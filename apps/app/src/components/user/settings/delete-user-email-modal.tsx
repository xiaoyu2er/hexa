'use client';

import { Input } from '@hexa/ui/input';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';

import { EmailSchema, type EmailType } from '@/features/common/schema';
import { $deleteUserEmail } from '@/lib/api';
import { setFormError } from '@/lib/form';
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

interface DeleteUserEmailProps {
  email: string;
}
export const DeleteUserEmailModal = NiceModal.create(
  ({ email }: DeleteUserEmailProps) => {
    const modal = useModal();

    const form = useForm<EmailType>({
      resolver: zodResolver(EmailSchema),
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
            <DialogTitle>Delete Email</DialogTitle>
            <DialogDescription>
              Warning: Permanently delete your email, and their respective
              stats. This action cannot be undone - please proceed with caution.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) => deleteUserEmail({ json }))}
              method="POST"
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        To verify, type&nbsp;
                        <span className="font-bold">{email}</span>&nbsp;below
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={errors.email ? 'border-destructive' : ''}
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
                  Delete Email
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

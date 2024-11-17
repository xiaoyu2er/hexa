'use client';

import { Input } from '@hexa/ui/input';

import { setFormError } from '@/lib/form';
import { invalidateWorkspacesQuery } from '@/lib/queries/workspace';
import { $createOrg } from '@/server/client';
import { Button } from '@hexa/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { toast } from '@hexa/ui/sonner';

import { InsertOrgSchema, type InsertOrgType } from '@/features/org/schema';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export const CreateOrgModal = NiceModal.create(() => {
  const modal = useModal();
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
    onSuccess: () => {
      toast.success('Workspace created successfully');
      modal.resolve();
      modal.remove();
      invalidateWorkspacesQuery();
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
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>Create a new organization</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => createOrg({ json }))}
            method="POST"
            className="md:space-y-4"
          >
            <DialogBody className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Description</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={errors.desc ? 'border-destructive' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormErrorMessage message={errors.root?.message} />
            </DialogBody>

            <DialogFooter>
              <Button className="w-full" type="submit" loading={isSubmitting}>
                Create Organization
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

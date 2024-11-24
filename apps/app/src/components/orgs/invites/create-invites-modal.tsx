'use client';

import { InputField } from '@/components/form/input-field';
import { $createInvites } from '@/lib/api';
import { setFormError } from '@/lib/form';
import type { SelectOrgType } from '@/server/schema/org';
import {
  CreateInvitesSchema,
  type CreateInvitesType,
} from '@/server/schema/org-invite';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { Form, FormControl, FormField, FormItem } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { Trash } from '@hexa/ui/icons';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hexa/ui/select';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';

export const CreateInvitesModal = NiceModal.create((org: SelectOrgType) => {
  const modal = useModal();
  const _router = useRouter();

  const form = useForm<CreateInvitesType>({
    resolver: zodResolver(CreateInvitesSchema),
    defaultValues: {
      orgId: org.id,
      invites: [{ email: '', role: 'MEMBER' }],
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    name: 'invites',
    control: form.control,
  });

  const { mutateAsync: createInvites } = useMutation({
    mutationFn: $createInvites,
    onError: (err) => {
      setFormError(err, setError);
      modal.reject(err);
    },
    onSuccess: () => {
      toast.success('Invites created successfully');
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
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a new project</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => createInvites({ json }))}
            method="POST"
            className="md:space-y-4"
          >
            <DialogBody className="space-y-2">
              {fields.map((field, index) => (
                <div className="flex w-full max-w-sm space-x-2" key={field.id}>
                  <InputField form={form} name={`invites.${index}.email`} />
                  <FormField
                    control={form.control}
                    name={`invites.${index}.role`}
                    render={({ field }) => (
                      <FormItem className="w-24 shrink-0">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MEMBER">Member</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="OWNER">Owner</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-2 h-6 w-6 p-0"
                    onClick={() => remove(index)}
                  >
                    <span className="sr-only">Remove invite</span>
                    <Trash strokeWidth={1.5} />
                  </Button>
                </div>
              ))}
              {fields.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ email: '', role: 'MEMBER' })}
                >
                  Add URL
                </Button>
              )}
              <FormErrorMessage message={errors.root?.message} />
            </DialogBody>

            <DialogFooter>
              <Button className="w-full" type="submit" loading={isSubmitting}>
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

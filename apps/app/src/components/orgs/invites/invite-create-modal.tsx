'use client';

import { Dialog } from '@/components/dialog';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { $createInvites } from '@/lib/api';
import { setFormError } from '@/lib/form';
import {
  CreateInvitesSchema,
  type CreateInvitesType,
} from '@/server/schema/org-invite';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { Trash } from '@hexa/ui/icons';
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import {} from '@hexa/ui/select';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';

import { OrgRoleOptions } from '@/server/schema/org-member';

export const CreateInvitesModal = NiceModal.create(
  (project: SelectProjectType) => {
    const modal = useModal();

    const form = useForm<CreateInvitesType>({
      resolver: zodResolver(CreateInvitesSchema),
      defaultValues: {
        orgId: project.org.id,
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

    const getRoleOptions = () => {
      switch (project.role) {
        case 'OWNER':
          return OrgRoleOptions;
        case 'ADMIN':
          return OrgRoleOptions.filter((option) => option.value !== 'OWNER');
        default:
          return OrgRoleOptions.filter((option) => option.value === 'MEMBER');
      }
    };

    return (
      <Dialog control={modal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>
              Invite members to your organization
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) => createInvites({ json }))}
              method="POST"
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
                {fields.map((field, index) => (
                  <div className="flex w-full space-x-2" key={field.id}>
                    <InputField
                      formItemClassName="flex-grow"
                      form={form}
                      name={`invites.${index}.email`}
                    />
                    <SelectField
                      formItemClassName="w-24 shrink-0"
                      form={form}
                      name={`invites.${index}.role`}
                      options={getRoleOptions()}
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
                    Add Invite
                  </Button>
                )}
                <FormErrorMessage message={errors.root?.message} />
              </DialogBody>

              <DialogFooter>
                <Button className="w-full" type="submit" loading={isSubmitting}>
                  Invite members
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

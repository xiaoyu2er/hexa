'use client';
import { Form, setFormError } from '@/components/form';
import { FormErrorMessage } from '@/components/form';
import { InputField } from '@/components/form';
import { SelectField } from '@/components/form';
import { $createInvites } from '@/lib/api';
import {
  CreateInvitesSchema,
  type CreateInvitesType,
} from '@/server/schema/org-invite';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { Trash } from '@hexa/ui/icons';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';

import { OrgRoleOptions } from '@/server/schema/org-member';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

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
      <Modal isOpen={modal.visible} onOpenChange={() => modal.hide()} size="md">
        <ModalContent>
          <ModalHeader>Invite Members</ModalHeader>
          <Form
            form={form}
            onSubmit={handleSubmit((json) => createInvites({ json }))}
          >
            <ModalBody className="space-y-2">
              {fields.map((field, index) => (
                <div
                  className="flex w-full items-start space-x-2"
                  key={field.id}
                >
                  <InputField
                    form={form}
                    name={`invites.${index}.email`}
                    size="md"
                    placeholder="Email"
                    hideErrorMessageCodes={['invalid_string']}
                  />
                  <SelectField
                    form={form}
                    size="md"
                    name={`invites.${index}.role`}
                    options={getRoleOptions()}
                  />
                  <Button
                    type="button"
                    variant="light"
                    isIconOnly
                    aria-label="Remove invite"
                    className="mt-2 h-6 w-6 min-w-6"
                    onPress={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </div>
              ))}
              {fields.length < 10 && (
                <Button
                  type="button"
                  variant="bordered"
                  size="sm"
                  className="w-fit"
                  onPress={() => append({ email: '', role: 'MEMBER' })}
                >
                  Add Invite
                </Button>
              )}
              <FormErrorMessage message={errors.root?.message} />
            </ModalBody>
            <ModalFooter>
              <Button
                className="w-full"
                color="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                Invite members
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    );
  }
);

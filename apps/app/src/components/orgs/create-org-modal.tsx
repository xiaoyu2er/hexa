'use client';

import { setFormError } from '@/components/form';
import { $createOrg } from '@/lib/api';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import {
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';

import { Form } from '@/components/form';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { toast } from '@hexa/ui/sonner';

import { Dialog } from '@/components/dialog';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { InsertOrgSchema, type InsertOrgType } from '@/server/schema/org';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { InputField } from '../form/input-field';

export const CreateOrgModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();
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
    onSuccess: (project) => {
      toast.success('Organization created successfully');
      modal.resolve();
      modal.remove();
      router.push(`/${project.id}`);
      invalidateProjectsQuery();
    },
  });

  return (
    <Dialog control={modal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>Create a new organization</DialogDescription>
        </DialogHeader>

        <Form
          form={form}
          onSubmit={handleSubmit((json) => createOrg({ json }))}
          className="md:space-y-4"
        >
          <DialogBody className="space-y-2">
            <InputField
              form={form}
              name="name"
              label="Organization name"
              placeholder="Acme Inc."
            />

            <InputField
              form={form}
              name="desc"
              label="Organization Description"
              placeholder="A description of the organization"
            />

            <FormErrorMessage message={errors.root?.message} />
          </DialogBody>

          <DialogFooter>
            <Button
              className="w-full"
              type="submit"
              isLoading={isSubmitting}
              color="primary"
            >
              Create Organization
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

'use client';
import { setFormError } from '@/lib/form';
import { Button } from '@hexa/ui/button';
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
import { SelectField } from '@/components/form/select-field';
import { $createLink } from '@/lib/api';
import { InsertLinkSchema, type InsertLinkType } from '@/server/schema/link';
import type { SelectProjectType } from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import {} from '@hexa/ui/select';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export const CreateLinkModal = NiceModal.create(
  (project: SelectProjectType) => {
    const modal = useModal();

    const form = useForm<InsertLinkType>({
      resolver: zodResolver(InsertLinkSchema),
      defaultValues: {
        projectId: project.id,
      },
    });

    const {
      handleSubmit,
      setError,
      formState: { isSubmitting, errors },
    } = form;

    const { mutateAsync: createLink } = useMutation({
      mutationFn: $createLink,
      onError: (err) => {
        setFormError(err, setError);
        modal.reject(err);
      },
      onSuccess: () => {
        toast.success('Project created successfully');
        modal.resolve();
        modal.remove();
      },
    });

    return (
      <Dialog control={modal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Link</DialogTitle>
            <DialogDescription>Create a new link</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) => createLink({ json }))}
              method="POST"
              className="md:space-y-4"
            >
              <DialogBody className="space-y-2">
                <InputField
                  form={form}
                  name="destUrl"
                  label="Destination URL"
                />

                <SelectField
                  form={form}
                  name="domain"
                  label="Domain"
                  placeholder="Select a domain"
                  options={project.domains.map((domain) => ({
                    label: domain,
                    value: domain,
                  }))}
                />
                <InputField form={form} name="slug" label="Slug" />
                <InputField form={form} name="title" label="Link Name" />
                <InputField form={form} name="desc" label="Description" />
                <FormErrorMessage message={errors.root?.message} />
              </DialogBody>

              <DialogFooter>
                <Button className="w-full" type="submit" loading={isSubmitting}>
                  Create Link
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

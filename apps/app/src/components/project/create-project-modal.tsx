'use client';

import { $createProject } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { invalidateProjectsQuery } from '@/lib/queries/project';
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
import { queryOrgsOptions } from '@/lib/queries/orgs';
import {
  InsertProjectSchema,
  type InsertProjectType,
} from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import {} from '@hexa/ui/select';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export const CreateProjectModal = NiceModal.create(() => {
  const modal = useModal();
  const router = useRouter();
  const {
    data: { data: orgs } = { data: [], rowCount: 0 },
  } = useQuery(queryOrgsOptions);
  const form = useForm<InsertProjectType>({
    resolver: zodResolver(InsertProjectSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: createProject } = useMutation({
    mutationFn: $createProject,
    onError: (err) => {
      setFormError(err, setError);
      modal.reject(err);
    },
    onSuccess: ({ project }) => {
      toast.success('Project created successfully');
      modal.resolve();
      modal.remove();
      invalidateProjectsQuery();
      router.push(`/project/${project.slug}`);
    },
  });

  return (
    <Dialog control={modal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a new workspace</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) =>
              createProject({ json: { ...json, orgId: json.orgId } })
            )}
            method="POST"
            className="md:space-y-4"
          >
            <DialogBody className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  formItemClassName="flex-grow"
                  form={form}
                  name="orgId"
                  label="Owner"
                  placeholder="Select an owner"
                  options={orgs?.map((org) => ({
                    label: org.name,
                    value: org.id,
                  }))}
                />

                <InputField form={form} name="slug" label="Project Slug" />
              </div>

              <InputField form={form} name="name" label="Project Name" />

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

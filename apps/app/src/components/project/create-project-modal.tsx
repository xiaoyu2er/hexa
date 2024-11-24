'use client';

import { $createProject } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { invalidateProjectsQuery } from '@/lib/queries/project';
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

import { queryOrgsOptions } from '@/lib/queries/orgs';
import {
  InsertProjectSchema,
  type InsertProjectType,
} from '@/server/schema/project';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hexa/ui/select';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { InputField } from '../form/input-field';

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
                <FormField
                  control={form.control}
                  name="orgId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {orgs?.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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

'use client';

import { Input } from '@hexa/ui/input';

import { $createProject } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { invalidateProjectsQuery } from '@/lib/queries/workspace';
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

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Slug</FormLabel>
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
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
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
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

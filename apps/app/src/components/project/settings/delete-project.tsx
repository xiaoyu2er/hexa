'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import { setFormError } from '@/components/form';
import { Form } from '@/components/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { InputField } from '@/components/form/input-field';
import { $deleteProject } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import {
  DELETE_PROJECT_CONFIRMATION,
  DeleteProjectSchema,
  type DeleteProjectType,
} from '@/server/schema/project';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@hexa/ui/responsive-dialog';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function DeleteProject() {
  const router = useRouter();
  const form = useForm<DeleteProjectType>({
    resolver: zodResolver(DeleteProjectSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  const { mutateAsync: deleteProject } = useMutation({
    mutationFn: $deleteProject,
    onError: (err) => {
      setFormError(err, setError);
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      invalidateProjectsQuery();
      router.replace('/');
    },
  });

  return (
    <Card className="border border-danger-500">
      <CardHeader>
        <CardTitle>Delete project</CardTitle>
        <CardDescription>
          Permanently delete your {NEXT_PUBLIC_APP_NAME} project, and it's
          respective stats. This action cannot be undone - please proceed with
          caution.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-row-reverse items-center justify-between border-danger-500 border-t px-6 py-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="submit" color="danger" className="shrink-0">
              Delete project
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <Form
              form={form}
              onSubmit={handleSubmit((json) =>
                deleteProject({
                  json,
                })
              )}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                  Permanently delete your {NEXT_PUBLIC_APP_NAME} project, and
                  it's respective stats. This action cannot be undone - please
                  proceed with caution.
                </DialogDescription>
              </DialogHeader>

              <InputField form={form} name="projectId" label="Project ID" />
              <InputField
                form={form}
                name="confirm"
                label={
                  <>
                    To verify, type
                    <span className="px-1 font-bold">
                      {DELETE_PROJECT_CONFIRMATION}
                    </span>
                    below
                  </>
                }
              />
              <FormErrorMessage message={errors.root?.message} />

              <DialogFooter>
                <Button
                  color="danger"
                  className="w-full"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {DELETE_PROJECT_CONFIRMATION}
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

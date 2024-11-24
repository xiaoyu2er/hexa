'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';

import { InputField } from '@/components/form/input-field';
import { useProject } from '@/hooks/use-project';
import { $updateProjectName } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import {
  type UpdateProjectNameType,
  UpdateProjectrNameSchema,
} from '@/server/schema/project';
import { Button } from '@hexa/ui/button';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function EditProjectName() {
  const { project, invalidate } = useProject();
  const form = useForm<UpdateProjectNameType>({
    resolver: zodResolver(UpdateProjectrNameSchema),
    defaultValues: useMemo(() => {
      return {
        name: project.name ?? '',
        projectId: project.id,
      };
    }, [project]),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: project.name ?? '',
      projectId: project.id,
    });
  }, [reset, project]);

  const { mutateAsync: updateProjectName } = useMutation({
    mutationFn: $updateProjectName,
    onError: (err) => {
      setError('name', { message: err.message });
    },
    onSuccess: () => {
      toast.success('The project name has been updated');
      reset();
      invalidate();
      invalidateProjectsQuery();
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((json) =>
          updateProjectName({
            json,
          })
        )}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Project name</CardTitle>
            <CardDescription>
              Project name will be displayed on&nbsp;
              {NEXT_PUBLIC_APP_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputField form={form} name="name" className="max-w-md" />
          </CardContent>
          <CardFooter className="flex-row-reverse items-center justify-between border-t px-6 py-4">
            <Button
              type="submit"
              className="shrink-0"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

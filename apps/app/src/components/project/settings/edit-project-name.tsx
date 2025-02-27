'use client';

import { Form } from '@/components/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

import { InputField } from '@/components/form';
import { useProject } from '@/hooks/use-project';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import { Button } from '@heroui/react';
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { $updateProjectName } from '@hexa/server/api';
import {
  type UpdateProjectNameType,
  UpdateProjectrNameSchema,
} from '@hexa/server/schema/project';
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
    <Form
      form={form}
      onSubmit={handleSubmit((json) =>
        updateProjectName({
          json,
        })
      )}
    >
      <Card>
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
        <CardFooter>
          <Button
            type="submit"
            color="primary"
            className="shrink-0"
            isLoading={isSubmitting}
            isDisabled={!isDirty}
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}

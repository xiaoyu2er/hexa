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
import { $updateOrgName } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import {
  UpdateOrgNameSchema,
  type UpdateOrgNameType,
} from '@/server/schema/org';
import {} from '@/server/schema/project';
import { Button } from '@hexa/ui/button';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function EditOrgName() {
  const {
    project: { org },
    invalidate,
  } = useProject();
  const form = useForm<UpdateOrgNameType>({
    resolver: zodResolver(UpdateOrgNameSchema),
    defaultValues: useMemo(() => {
      return {
        name: org.name ?? '',
        projectId: org.id,
      };
    }, [org]),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: org.name ?? '',
      orgId: org.id,
    });
  }, [reset, org]);

  const { mutateAsync: updateOrgName } = useMutation({
    mutationFn: $updateOrgName,
    onError: (err) => {
      setError('name', { message: err.message });
    },
    onSuccess: () => {
      toast.success('The organization name has been updated');
      reset();
      invalidate();
      invalidateProjectsQuery();
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((json) =>
          updateOrgName({
            json,
          })
        )}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Organization name</CardTitle>
            <CardDescription>
              Organization name will be displayed on&nbsp;
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

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
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { $updateOrgName } from '@hexa/server/api';
import {
  UpdateOrgNameSchema,
  type UpdateOrgNameType,
} from '@hexa/server/schema/org';

import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
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
    <Form
      form={form}
      onSubmit={handleSubmit((json) =>
        updateOrgName({
          json,
        })
      )}
    >
      <Card>
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
        <CardFooter>
          <Button
            type="submit"
            color="primary"
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

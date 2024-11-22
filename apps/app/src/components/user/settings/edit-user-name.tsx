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

import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';

import { NameField } from '@/components/form/name-field';
import { useSession } from '@/components/providers/session-provider';
import { $updateUserName } from '@/lib/api';
import { setFormError } from '@/lib/form';
import {} from '@/server/schema/project';
import {
  UpdateUserNameSchema,
  type UpdateUserNameType,
} from '@/server/schema/user';
import { Button } from '@hexa/ui/button';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function EditUserName() {
  const { user, refetch } = useSession();
  const form = useForm<UpdateUserNameType>({
    resolver: zodResolver(UpdateUserNameSchema),
    defaultValues: useMemo(() => {
      return {
        name: user.name ?? '',
      };
    }, [user]),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: user.name ?? '',
    });
  }, [reset, user]);

  const { mutateAsync: updateUserName } = useMutation({
    mutationFn: $updateUserName,
    onError: (err) => {
      setFormError(err, setError, 'name', true);
    },
    onSuccess: () => {
      toast.success('Your name is updated!');
      reset();
      refetch();
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((json) =>
          updateUserName({
            json,
          })
        )}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Name</CardTitle>
            <CardDescription>
              This will be your name on&nbsp;
              {NEXT_PUBLIC_APP_NAME} seen by your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NameField form={form} showLabel={false} />
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

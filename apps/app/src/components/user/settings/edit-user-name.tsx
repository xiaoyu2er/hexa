'use client';

import { setFormError } from '@/components/form';
import { InputField } from '@/components/form/input-field';
import { useUser } from '@/hooks/use-user';
import { $updateUserName } from '@/lib/api';
import {} from '@/server/schema/project';
import {
  UpdateUserNameSchema,
  type UpdateUserNameType,
} from '@/server/schema/user';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function EditUserName() {
  const { user, refetch } = useUser();
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
            <CardTitle>User name</CardTitle>
            <CardDescription>
              This is your public display name. It can be your real name or a
              pseudonym.
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

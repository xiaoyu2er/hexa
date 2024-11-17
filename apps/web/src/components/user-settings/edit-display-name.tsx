'use client';

import {
  type UpdateDisplayNameInput,
  UpdateDisplayNameSchema,
} from '@/lib/zod/schemas/user';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';

import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { setFormError } from '@/lib/form';
import { $updateUserDisplayName } from '@/server/client';
import { Button } from '@hexa/ui/button';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from '../providers/session-provider';

export function EditUserDisplayName() {
  const { user, refetch } = useSession();

  const form = useForm<UpdateDisplayNameInput>({
    resolver: zodResolver(UpdateDisplayNameSchema),
    defaultValues: useMemo(() => {
      return {
        displayName: user?.displayName ?? '',
      };
    }, [user?.displayName]),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      displayName: user?.displayName ?? '',
    });
  }, [reset, user?.displayName]);

  const { mutateAsync: updateDisplayName } = useMutation({
    mutationFn: $updateUserDisplayName,
    onError: (err) => {
      setFormError(err, setError, 'displayName');
    },
    onSuccess: () => {
      toast.success('Your name has been updated');
      refetch();
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((json) => updateDisplayName({ json }))}
        method="POST"
        className="grid gap-4"
      >
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Name</CardTitle>
            <CardDescription>
              Your name may appear around {NEXT_PUBLIC_APP_NAME}. You can remove
              it at any time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

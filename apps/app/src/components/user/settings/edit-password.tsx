'use client';
import { setFormError } from '@/components/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { InputField } from '@/components/form/input-field';
import { useUser } from '@/hooks/use-user';
import { $updateUserPassword } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { EditPasswordSchema } from '@/server/schema/reset-password';
import type { EditPasswordType } from '@/server/schema/reset-password';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Form, useForm } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

export function EditPassword() {
  const { user, refetch } = useUser();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const form = useForm<EditPasswordType>({
    resolver: zodResolver(EditPasswordSchema),
    defaultValues: {},
  });
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
    reset,
  } = form;

  const cancelUpdate = () => {
    reset();
    setShowResetPassword(false);
  };

  const { mutateAsync: updatePassword } = useMutation({
    mutationFn: $updateUserPassword,
    onSuccess: () => {
      toast.success('Password updated');
      refetch();
      reset();
      setShowResetPassword(false);
    },
    onError: (error) => {
      setFormError(error, setError);
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        {user.hasPassword ? (
          <CardDescription>
            Strengthen your account by ensuring your password is strong.
          </CardDescription>
        ) : (
          <CardDescription>
            Set a password to have an alternative way to log into your&nbsp;
            {NEXT_PUBLIC_APP_NAME} account.
          </CardDescription>
        )}
      </CardHeader>

      {showResetPassword ? (
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => updatePassword({ json }))}
            method="POST"
          >
            <CardContent className="max-w-md space-y-2">
              {user.hasPassword && (
                <InputField
                  form={form}
                  name="oldPassword"
                  label="Old Password"
                  type="password"
                />
              )}
              <InputField
                form={form}
                name="password"
                label={user.hasPassword ? 'New Password' : 'Password'}
                type="password"
              />
              <InputField
                form={form}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />
              <FormErrorMessage message={errors.root?.message} />
              <Button variant="link" size="sm" className="p-0" asChild>
                <Link href="/reset-password">Forgot password?</Link>
              </Button>
            </CardContent>
            <CardFooter className="flex-row-reverse items-center gap-4 border-t px-6 py-4">
              <Button type="submit" className="shrink-0" loading={isSubmitting}>
                {user.hasPassword ? 'Update' : 'Set'} password
              </Button>
              <Button
                variant="outline"
                className="shrink-0"
                onClick={cancelUpdate}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Form>
      ) : (
        <>
          <CardContent>
            {user.hasPassword && (
              <Input placeholder="********" className="max-w-md" disabled />
            )}
          </CardContent>
          <CardFooter className="flex-row-reverse items-center gap-4 border-t px-6 py-4">
            <Button
              type="submit"
              className="shrink-0"
              onClick={() => setShowResetPassword(true)}
            >
              {user.hasPassword ? 'Update' : 'Set'} password
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

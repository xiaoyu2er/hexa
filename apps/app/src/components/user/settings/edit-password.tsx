'use client';
import { PasswordField } from '@/components/form/password-field';
import { useSession } from '@/components/providers/session-provider';
import { EditPasswordSchema } from '@/features/auth/reset-password/schema';
import type { EditPasswordType } from '@/features/auth/reset-password/schema';
import { $updateUserPassword } from '@/lib/api';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { setFormError } from '@/lib/form';
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
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { Input } from '@hexa/ui/input';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

export function EditPassword() {
  const { user, refetch } = useSession();
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
                <PasswordField
                  form={form}
                  name="oldPassword"
                  label="Old Password"
                />
              )}
              <PasswordField
                form={form}
                name="password"
                label={user.hasPassword ? 'New Password' : 'Password'}
              />
              <PasswordField
                form={form}
                name="confirmPassword"
                label="Confirm Password"
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

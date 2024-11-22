'use client';

import {
  ResetPasswordSchema,
  type ResetPasswordType,
} from '@/features/auth/reset-password/schema';
import { $resetPassword } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';
import { useMutation } from '@tanstack/react-query';

import { PasswordField } from '@/components/form/password-field';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ResetParsswordCardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  token?: string;
}

export const ResetPassword: FC<ResetParsswordCardProps> = ({
  onSuccess,
  onCancel,
  token,
}) => {
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { mutateAsync: resetPassword } = useMutation({
    mutationFn: $resetPassword,
    onSuccess,
    onError: (error) => {
      // resetTurnstile();
      setFormError(error, setError);
    },
  });

  useEffect(() => {
    setFocus('password');
  }, [setFocus]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => resetPassword({ json }))}
            method="POST"
            className="space-y-2"
          >
            <PasswordField form={form} name="password" label="Password" />
            <PasswordField
              form={form}
              name="confirmPassword"
              label="Confirm Password"
            />
            <FormErrorMessage message={errors.root?.message} />

            <Button variant="link" size="sm" className="p-0" asChild>
              <Link href="/signup">Not signed up? Sign up now.</Link>
            </Button>
            <Button className="w-full" type="submit" loading={isSubmitting}>
              Reset Password
            </Button>
            <Button variant="outline" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
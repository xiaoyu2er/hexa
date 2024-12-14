'use client';

import { AuthLink } from '@/components/auth/auth-link';
import { setFormError } from '@/components/form';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { PasswordField } from '@/components/form/password-field';
import { $resetPassword } from '@/lib/api';
import {
  ResetPasswordSchema,
  type ResetPasswordType,
} from '@/server/schema/reset-password';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
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
            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />
            <PasswordField
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Enter your password again"
            />
            <FormErrorMessage message={errors.root?.message} />

            <AuthLink href="/signup">Not signed up? Sign up now.</AuthLink>
            <Button
              color="primary"
              className="w-full"
              type="submit"
              isLoading={isSubmitting}
            >
              Reset Password
            </Button>
            <Button variant="ghost" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

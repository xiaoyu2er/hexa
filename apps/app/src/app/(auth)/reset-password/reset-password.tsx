'use client';

import { AuthLink } from '@/components/auth/auth-link';
import { Form, FormErrorMessage, setFormError } from '@/components/form';
import { PasswordField } from '@/components/form';
import { Button } from '@heroui/react';
import type { $resetPassword, InferApiResponseType } from '@hexa/server/api';
import {
  ResetPasswordSchema,
  type ResetPasswordType,
} from '@hexa/server/schema/reset-password';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ResetParsswordCardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onReset?: (
    data: ResetPasswordType
  ) => Promise<InferApiResponseType<typeof $resetPassword>>;
  token?: string;
}

export const ResetPassword: FC<ResetParsswordCardProps> = ({
  onSuccess,
  onCancel,
  onReset,
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
    mutationFn: onReset,
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
        <Form
          form={form}
          onSubmit={handleSubmit((json) => resetPassword(json))}
          className="space-y-2"
        >
          <PasswordField
            form={form}
            name="password"
            label="Password"
            isRequired
          />
          <PasswordField
            form={form}
            name="confirmPassword"
            label="Confirm Password"
            isRequired
          />
          <FormErrorMessage message={errors.root?.message} />

          <AuthLink href="/signup" withSearchParams>
            Not signed up? Sign up now.
          </AuthLink>
          <Button
            color="primary"
            className="w-full"
            type="submit"
            isLoading={isSubmitting}
          >
            Reset Password
          </Button>
          <Button variant="ghost" className="w-full" onPress={onCancel}>
            Cancel
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

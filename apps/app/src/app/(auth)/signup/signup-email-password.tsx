'use client';

import { FormErrorMessage } from '@/components/form/form-error-message';
import {} from '@/server/schema/signup';
import { Button } from '@nextui-org/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Divider } from '@hexa/ui/divider';
import { Form } from '@hexa/ui/form';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AuthLink } from '@/components/auth/auth-link';
import { OauthButtons } from '@/components/auth/oauth-buttons';
import { InputField } from '@/components/form/input-field';
import { PasswordField } from '@/components/form/password-field';
import { useTurnstile } from '@/hooks/use-turnstile';
import { $checkEmail } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { PasswordSchema, type PasswordType } from '@/server/schema/common';
import { CheckEmailSchema } from '@/server/schema/user';
import type { CheckEmailType } from '@/server/schema/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { omit } from 'lodash';

interface SignupEmailPasswordProps {
  email: string | null | undefined;
  onSuccess: (data: { email: string; password: string }) => void;
  onCancel?: () => void;
}

export const SignupEmailPassword: FC<SignupEmailPasswordProps> = ({
  email,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<CheckEmailType & PasswordType>({
    resolver: zodResolver(CheckEmailSchema.merge(PasswordSchema)),
    defaultValues: {
      email: email ?? undefined,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { resetTurnstile, turnstile, disableNext } = useTurnstile({ form });

  const { mutateAsync: checkUserEmail } = useMutation({
    mutationFn: $checkEmail,
    onSuccess: () => {
      onSuccess({
        email: form.getValues('email'),
        password: form.getValues('password'),
      });
    },
    onError: (error) => {
      resetTurnstile();
      setFormError(error, setError);
    },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <OauthButtons />
        <Divider>or</Divider>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) =>
              checkUserEmail({
                json: omit(json, ['password']),
              })
            )}
            method="POST"
            className="space-y-2"
          >
            <InputField
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />
            <FormErrorMessage message={errors.root?.message} />
            {turnstile}

            <AuthLink href="/login">Have an account? Login</AuthLink>
            <Button
              color="primary"
              className="w-full"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={disableNext}
            >
              Continue
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

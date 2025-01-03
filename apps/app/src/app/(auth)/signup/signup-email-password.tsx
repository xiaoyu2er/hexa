'use client';

import { FormErrorMessage } from '@/components/form';
import {} from '@hexa/server/schema/signup';
import { Button } from '@nextui-org/react';

import { Form } from '@/components/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AuthLink } from '@/components/auth/auth-link';
import { DividerOr } from '@/components/auth/divider-or';
import { OauthButtons } from '@/components/auth/oauth-buttons';
import { setFormError } from '@/components/form';
import { InputField } from '@/components/form';
import { PasswordField } from '@/components/form';
import { useTurnstile } from '@/hooks/use-turnstile';
import { $checkEmail } from '@hexa/server/api';
import { PasswordSchema, type PasswordType } from '@hexa/server/schema/common';
import { CheckEmailSchema } from '@hexa/server/schema/user';
import type { CheckEmailType } from '@hexa/server/schema/user';
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
        <DividerOr />
        <Form
          form={form}
          onSubmit={handleSubmit((json) =>
            checkUserEmail({
              json: omit(json, ['password']),
            })
          )}
          className="space-y-2"
        >
          <InputField
            form={form}
            name="email"
            label="Email"
            type="email"
            isRequired
          />
          <PasswordField
            form={form}
            name="password"
            label="Password"
            isRequired
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
          <Button variant="ghost" className="w-full" onPress={onCancel}>
            Cancel
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
};

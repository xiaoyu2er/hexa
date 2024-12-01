'use client';

import Link from 'next/link';

import {} from '@/server/schema/signup';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Divider } from '@hexa/ui/divider';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { OauthButtons } from '@/components/auth/oauth-buttons';
import { InputField } from '@/components/form/input-field';
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
      email: email ?? '',
      password: '',
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
            <InputField form={form} name="email" label="Email" type="email" />
            <InputField
              form={form}
              name="password"
              label="Password"
              type="password"
            />
            <FormErrorMessage message={errors.root?.message} />
            {turnstile}
            <Button variant="link" size="sm" className="p-0" asChild>
              <Link href="/login">Have an account? Login</Link>
            </Button>
            <Button
              className="w-full"
              type="submit"
              loading={isSubmitting}
              disabled={disableNext}
            >
              Continue
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

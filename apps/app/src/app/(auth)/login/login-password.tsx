'use client';

import Link from 'next/link';

import { Form } from '@hexa/ui/form';

import { Button } from '@hexa/ui/button';

import {
  LoginPasswordSchema,
  type LoginPasswordType,
} from '@/server/schema/login';

import { OauthButtons } from '@/components/auth/oauth-buttons';
import { InputField } from '@/components/form/input-field';
import { useTurnstile } from '@/hooks/use-turnstile';
import { $loginPassword } from '@/lib/api';
import { setFormError } from '@/lib/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Divider } from '@hexa/ui/divider';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function LoginPassword() {
  const form = useForm<LoginPasswordType>({
    resolver: zodResolver(LoginPasswordSchema),
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { resetTurnstile, turnstile, disableNext } = useTurnstile({
    form,
    onSuccess: () => {
      clearErrors('root');
    },
  });

  const { mutateAsync: loginPassword } = useMutation({
    mutationFn: $loginPassword,
    onSuccess: () => {
      toast.success('Login successful');
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
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Log in to your account to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OauthButtons />
          <Divider>or</Divider>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) => loginPassword({ json }))}
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

              {turnstile}

              <div className="flex flex-wrap justify-between">
                <Button variant="link" size="sm" className="p-0" asChild>
                  <Link href="/signup">Not signed up? Sign up now.</Link>
                </Button>
                <Button variant="link" size="sm" className="p-0" asChild>
                  <Link href="/reset-password">Forget password?</Link>
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={disableNext}
                key="login"
              >
                Login
              </Button>

              <Button variant="ghost" className="w-full" key="cancel" asChild>
                <Link href="/login-passcode" replace>
                  Login with Passcode
                </Link>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

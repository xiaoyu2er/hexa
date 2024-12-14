'use client';

import { setFormError } from '@/components/form';
import { useTurnstile } from '@/hooks/use-turnstile';
import { $loginPassword } from '@/lib/api';
import {
  LoginPasswordSchema,
  type LoginPasswordType,
} from '@/server/schema/login';
import { Form } from '@hexa/ui/form';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Link } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { AuthLink } from '@/components/auth/auth-link';
import { DividerOr } from '@/components/auth/divider-or';
import { OauthButtons } from '@/components/auth/oauth-buttons';
import { FormErrorMessage } from '@/components/form/form-error-message';
import { InputField } from '@/components/form/input-field';
import { PasswordField } from '@/components/form/password-field';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { useEffect } from 'react';

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
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Log in to your {NEXT_PUBLIC_APP_NAME} account to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OauthButtons />
        <DividerOr />
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit((json) => loginPassword({ json }))}
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
            <div className="flex flex-wrap justify-between">
              <AuthLink href="/signup">Not signed up? Sign up now.</AuthLink>
              <AuthLink href="/reset-password">Forget password?</AuthLink>
            </div>
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={disableNext}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              key="cancel"
              as={Link}
              href="/login-passcode"
            >
              Login with passcode
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

'use client';

import Link from 'next/link';

import { SignupSchema, type SignupType } from '@/features/auth/signup/schema';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Divider } from '@hexa/ui/divider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { Input } from '@hexa/ui/input';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { OauthButtons } from '@/components/auth/oauth-buttons';
import { useTurnstile } from '@/components/hooks/use-turnstile';
import { $signup, type InferApiResponseType } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { PasswordInput } from '@hexa/ui/password-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

interface SignupProps {
  email: string | null | undefined;
  onSuccess: (data: InferApiResponseType<typeof $signup>) => void;
  onCancel?: () => void;
}

export const Signup: FC<SignupProps> = ({ email, onSuccess, onCancel }) => {
  const form = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: email ?? '',
      password: '',
      name: '',
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;
  const { resetTurnstile, turnstile, disableNext } = useTurnstile({ form });

  const { mutateAsync: signup } = useMutation({
    mutationFn: $signup,
    onSuccess: (res) => {
      onSuccess?.(res);
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
            onSubmit={handleSubmit((json) => signup({ json }))}
            method="POST"
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="email@example.com"
                      autoComplete="email"
                      type="email"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="username"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="current-password"
                      placeholder="********"
                      className={errors.password ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              Sign Up
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

'use client';

import {
  type OauthSignupInput,
  OauthSignupSchema,
} from '@/features/auth/oauth/schema';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
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

import { useTurnstile } from '@/components/hooks/use-turnstile';
import type { SelectOauthAccountType } from '@/features/auth/oauth/schema';
import { setFormError } from '@/lib/form';
import { $oauthSignup } from '@/server/client';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { capitalize } from 'lodash';
import Link from 'next/link';

interface OauthSignupProps {
  oauthAccount: SelectOauthAccountType;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const OauthSignup: FC<OauthSignupProps> = ({
  oauthAccount,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<OauthSignupInput>({
    resolver: zodResolver(OauthSignupSchema),
    defaultValues: {
      oauthAccountId: oauthAccount.id,
    },
  });

  const {
    handleSubmit,
    setError,
    register,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;
  const { resetTurnstile, turnstile, disableNext } = useTurnstile({ form });

  const { mutateAsync: oauthSignup } = useMutation({
    mutationFn: $oauthSignup,
    onSuccess: () => {
      toast.success('Sign up success');
      onSuccess?.();
    },
    onError: (error) => {
      resetTurnstile();
      setFormError(error, setError);
    },
  });

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Create your username to start using the app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => oauthSignup({ json }))}
            method="POST"
            className="space-y-4"
          >
            <FormItem>
              <FormLabel>{capitalize(oauthAccount.provider)} Account</FormLabel>
              <Input value={`${oauthAccount.username}`} disabled />
            </FormItem>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className={errors.name ? 'border-destructive' : ''}
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

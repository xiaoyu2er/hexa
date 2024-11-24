'use client';

import { InputField } from '@/components/form/input-field';
import { useTurnstile } from '@/hooks/use-turnstile';
import {
  $loginPasscodeSendPasscode,
  type InferApiResponseType,
} from '@/lib/api';
import { setFormError } from '@/lib/form';
import {
  SendPasscodeSchema,
  type SendPasscodeType,
} from '@/server/schema/passcode';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface LoginPasscodeProps {
  onSuccess?: (
    _data: InferApiResponseType<typeof $loginPasscodeSendPasscode>
  ) => void;
}

export function LoginPasscode({ onSuccess }: LoginPasscodeProps) {
  const form = useForm<SendPasscodeType>({
    resolver: zodResolver(SendPasscodeSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { resetTurnstile, turnstile, disableNext } = useTurnstile({
    form,
  });

  const { mutateAsync: loginPasscodeSendPasscode } = useMutation({
    mutationFn: $loginPasscodeSendPasscode,
    onSuccess,
    onError: (error) => {
      setFormError(error, setError);
      resetTurnstile();
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
            We'll send you a passcode to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) =>
                loginPasscodeSendPasscode({ json })
              )}
              className="space-y-2"
            >
              <InputField form={form} name="email" label="Email" type="email" />
              <FormErrorMessage message={errors.root?.message} />
              {turnstile}
              <Button
                type="submit"
                className="!mt-4 w-full"
                loading={isSubmitting}
                disabled={disableNext}
                key="login"
              >
                Login
              </Button>

              <Button variant="ghost" className="w-full" key="cancel" asChild>
                <Link href="/login" replace>
                  Back
                </Link>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

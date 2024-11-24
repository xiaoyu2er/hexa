'use client';

import { InputField } from '@/components/form/input-field';
import { useTurnstile } from '@/hooks/use-turnstile';
import {
  $resetPasswordSendPasscode,
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
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ForgetPasswordProps {
  email: string;
  onSuccess: (
    data: InferApiResponseType<typeof $resetPasswordSendPasscode>
  ) => void;
  onCancel?: () => void;
}

export const ForgetPassword: FC<ForgetPasswordProps> = ({
  email,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<SendPasscodeType>({
    resolver: zodResolver(SendPasscodeSchema),
    defaultValues: {
      email,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { resetTurnstile, turnstile, disableNext } = useTurnstile({
    form,
    errorField: 'email',
  });

  const { mutateAsync: resetPasswordSendPasscode } = useMutation({
    mutationFn: $resetPasswordSendPasscode,
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
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Forget Password?</CardTitle>
        <CardDescription>
          We'll send you a passcode to your email to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) =>
              resetPasswordSendPasscode({ json })
            )}
            method="POST"
            className="space-y-2"
          >
            <InputField form={form} name="email" label="Email" type="email" />
            <FormErrorMessage message={errors.root?.message} />
            {turnstile}
            <Button variant="link" size="sm" className="p-0" asChild>
              <Link href="/signup">Not signed up? Sign up now.</Link>
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

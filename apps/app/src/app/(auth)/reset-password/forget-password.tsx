'use client';

import { setFormError } from '@/components/form';
import { FormErrorMessage } from '@/components/form';
import { InputField } from '@/components/form';
import { useTurnstile } from '@/hooks/use-turnstile';
import { Button } from '@heroui/react';
import type {
  $resetPasswordSendPasscode,
  InferApiResponseType,
} from '@hexa/server/api';
import {
  SendPasscodeSchema,
  type SendPasscodeType,
} from '@hexa/server/schema/passcode';

import { AuthLink } from '@/components/auth/auth-link';
import { Form } from '@/components/form';
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

export interface ForgetPasswordProps {
  email: string;
  onSendPasscode?: (
    data: SendPasscodeType
  ) => Promise<InferApiResponseType<typeof $resetPasswordSendPasscode>>;
  onSuccess: (
    data: InferApiResponseType<typeof $resetPasswordSendPasscode>
  ) => void;
  onCancel?: () => void;
}

export const ForgetPassword: FC<ForgetPasswordProps> = ({
  email,
  onSendPasscode,
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
    mutationFn: onSendPasscode,
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
        <Form
          form={form}
          onSubmit={handleSubmit((json) => resetPasswordSendPasscode(json))}
          className="space-y-2"
        >
          <InputField
            form={form}
            name="email"
            label="Email"
            type="email"
            isRequired
          />
          <FormErrorMessage message={errors.root?.message} />
          {turnstile}
          <AuthLink href="/signup" withSearchParams>
            Not signed up? Sign up now.
          </AuthLink>
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
        </Form>
      </CardContent>
    </Card>
  );
};

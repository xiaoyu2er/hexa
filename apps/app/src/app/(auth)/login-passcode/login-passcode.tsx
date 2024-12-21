'use client';

import {
  Form,
  FormErrorMessage,
  InputField,
  setFormError,
} from '@/components/form';
import { useTurnstile } from '@/hooks/use-turnstile';
import {
  $loginPasscodeSendPasscode,
  type InferApiResponseType,
} from '@hexa/server/api';
import {
  SendPasscodeSchema,
  type SendPasscodeType,
} from '@hexa/server/schema/passcode';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { Button, Link } from '@nextui-org/react';
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

  const { resetTurnstile, turnstile } = useTurnstile({
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
          <Form
            form={form}
            onSubmit={handleSubmit((json) =>
              loginPasscodeSendPasscode({ json })
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
            <FormErrorMessage message={errors.root?.message} />
            {turnstile}
            <Button
              color="primary"
              type="submit"
              className="!mt-4 w-full"
              isLoading={isSubmitting}
              key="login"
            >
              Login
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              key="cancel"
              as={Link}
              href="/login"
            >
              Back
            </Button>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

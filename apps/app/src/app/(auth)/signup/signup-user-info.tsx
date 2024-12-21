'use client';

import { FormErrorMessage } from '@/components/form';
import { Button } from '@nextui-org/react';

import { Form } from '@/components/form';
import { Card, CardContent, CardHeader, CardTitle } from '@hexa/ui/card';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { TermsPrivacy } from '@/components/auth/terms-privacy';
import { setFormError } from '@/components/form';
import { InputField } from '@/components/form';
import { useTurnstile } from '@/hooks/use-turnstile';
import {
  $signupSendPasscode,
  type InferApiResponseType,
} from '@hexa/server/api';
import { SignupSchema, type SignupType } from '@hexa/server/schema/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

interface SignupProps {
  email?: string;
  password?: string;
  onSuccess: (data: InferApiResponseType<typeof $signupSendPasscode>) => void;
  onCancel?: () => void;
}

export const SignupUserInfo: FC<SignupProps> = ({
  email,
  password,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: email,
      password: password,
      orgName: null,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;
  const { resetTurnstile, turnstile } = useTurnstile({ form });

  const { mutateAsync: signup } = useMutation({
    mutationFn: $signupSendPasscode,
    onSuccess: (res) => {
      onSuccess?.(res);
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
        <CardTitle>Tell us a bit about yourself</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={handleSubmit((json) => signup({ json }))}
          className="space-y-4"
        >
          <InputField
            form={form}
            name="name"
            label="Your name"
            placeholder="Jane Doe"
            isRequired
          />
          <InputField
            form={form}
            name="orgName"
            label="Organization name"
            placeholder="Acme Inc."
          />
          <FormErrorMessage message={errors.root?.message} />
          {turnstile}
          <Button
            color="primary"
            className="w-full"
            type="submit"
            isLoading={isSubmitting}
          >
            Create account
          </Button>
          {/* <Button variant="outline" className="w-full" onClick={onCancel}>
              Go back
            </Button> */}
          <TermsPrivacy />
        </Form>
      </CardContent>
    </Card>
  );
};

'use client';

import { FormErrorMessage } from '@/components/form';
import { Button, Link } from '@nextui-org/react';

import { Form } from '@/components/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AuthLink } from '@/components/auth/auth-link';
import { DividerOr } from '@/components/auth/divider-or';
import { OauthButtons } from '@/components/auth/oauth-buttons';
import { TermsPrivacy } from '@/components/auth/terms-privacy';
import { setFormError } from '@/components/form';
import { InputField } from '@/components/form';
import { PasswordField } from '@/components/form';
import { useTurnstile } from '@/hooks/use-turnstile';
import type {
  $signupSendPasscode,
  InferApiResponseType,
} from '@hexa/server/api';
import { SignupSchema, type SignupType } from '@hexa/server/schema/signup';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface SignupEmailPasswordProps {
  email: string | null | undefined;
  onSignup: (
    data: SignupType
  ) => Promise<InferApiResponseType<typeof $signupSendPasscode>>;
  onSuccess: (data: InferApiResponseType<typeof $signupSendPasscode>) => void;
}

export const SignupEmailPassword: FC<SignupEmailPasswordProps> = ({
  email,
  onSignup,
  onSuccess,
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const form = useForm<SignupType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: email ?? undefined,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { resetTurnstile, turnstile, disableNext } = useTurnstile({ form });

  const { mutateAsync: signupSendPasscode } = useMutation({
    mutationFn: onSignup,
    onSuccess: (res) => {
      onSuccess(res);
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
        <DividerOr />
        <Form
          form={form}
          onSubmit={handleSubmit((json) => signupSendPasscode(json))}
          className="space-y-2"
        >
          <InputField
            form={form}
            name="email"
            label="Email"
            type="email"
            isRequired
          />
          <PasswordField
            form={form}
            name="password"
            label="Password"
            isRequired
          />
          <FormErrorMessage message={errors.root?.message} />
          {turnstile}

          <AuthLink href="/login" withSearchParams>
            Have an account? Login
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
          <Button
            variant="ghost"
            className="w-full"
            as={Link}
            href={`/login${search}`}
          >
            Cancel
          </Button>
          <TermsPrivacy />
        </Form>
      </CardContent>
    </Card>
  );
};

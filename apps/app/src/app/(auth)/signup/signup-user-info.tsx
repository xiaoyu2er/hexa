'use client';

import { Button } from '@hexa/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { TermsPrivacy } from '@/components/auth/terms-privacy';
import { NameField } from '@/components/form/name-field';
import { OrgNameField } from '@/components/form/org-name-field';
import { useTurnstile } from '@/components/hooks/use-turnstile';
import { $signupSendPasscode, type InferApiResponseType } from '@/lib/api';
import { setFormError } from '@/lib/form';
import { SignupSchema, type SignupType } from '@/server/schema/signup';
import {} from '@hexa/ui/collapsible';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

interface SignupProps {
  email: string;
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
  const { resetTurnstile, turnstile, disableNext } = useTurnstile({ form });

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
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => signup({ json }))}
            method="POST"
            className="space-y-4"
          >
            <NameField form={form} />
            <OrgNameField form={form} />
            <FormErrorMessage message={errors.root?.message} />
            {turnstile}

            <Button
              className="w-full"
              type="submit"
              loading={isSubmitting}
              disabled={disableNext}
            >
              Create account
            </Button>
            {/* <Button variant="outline" className="w-full" onClick={onCancel}>
              Go back
            </Button> */}
            <TermsPrivacy />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

'use client';

import { TermsPrivacy } from '@/components/auth/terms-privacy';
import {
  Form,
  FormErrorMessage,
  InputField,
  setFormError,
} from '@/components/form';
import { useTurnstile } from '@/hooks/use-turnstile';
import { $oauthSignup, type InferApiResponseType } from '@/lib/api';
import {
  OauthSignupSchema,
  type OauthSignupType,
  type SelectOauthAccountType,
} from '@/server/schema/oauth';
import { Card, CardContent, CardHeader, CardTitle } from '@hexa/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface OauthSignupProps {
  oauthAccount: SelectOauthAccountType;
  onSuccess?: (data: InferApiResponseType<typeof $oauthSignup>) => void;
  onCancel?: () => void;
}

export const OauthSignup: FC<OauthSignupProps> = ({
  oauthAccount,
  onSuccess,
}) => {
  const form = useForm<OauthSignupType>({
    resolver: zodResolver(OauthSignupSchema),
    defaultValues: {
      oauthAccountId: oauthAccount.id,
      name: oauthAccount.name ?? '',
      email: oauthAccount.email ?? '',
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
    mutationFn: $oauthSignup,
    onSuccess,
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
            isRequired
            isReadOnly
            name="email"
            label="Email"
          />
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
            isDisabled={disableNext}
          >
            Create account
          </Button>
          <TermsPrivacy />
        </Form>
      </CardContent>
    </Card>
  );
};

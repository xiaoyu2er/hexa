'use client';

import { TermsPrivacy } from '@/components/auth/terms-privacy';
import { EmailField } from '@/components/form/email-field';
import { NameField } from '@/components/form/name-field';
import { OrgNameField } from '@/components/form/org-name-field';
import { useTurnstile } from '@/hooks/use-turnstile';
import { $oauthSignup, type InferApiResponseType } from '@/lib/api';
import { setFormError } from '@/lib/form';
import {
  OauthSignupSchema,
  type OauthSignupType,
  type SelectOauthAccountType,
} from '@/server/schema/oauth';
import {} from '@/server/schema/signup';
import { Button } from '@hexa/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@hexa/ui/card';
import { Form } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { zodResolver } from '@hookform/resolvers/zod';
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
      email: oauthAccount.email,
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
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => signup({ json }))}
            method="POST"
            className="space-y-4"
          >
            <EmailField form={form} disabled />
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

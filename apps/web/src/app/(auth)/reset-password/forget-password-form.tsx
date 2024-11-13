'use client';

import { useTurnstile } from '@/components/hooks/use-turnstile';
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
import { Input } from '@hexa/ui/input';

import { setFormError } from '@/lib/form';
import {
  type SendPasscodeForm,
  SendPasscodeSchema,
} from '@/lib/zod/schemas/auth';
import { $sendPasscode, type InferApiResponseType } from '@/server/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { type FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export interface ForgetPasswordCardProps {
  email: string;
  onSuccess: (data: InferApiResponseType<typeof $sendPasscode>) => void;
  onCancel?: () => void;
}

export const ForgetPasswordCard: FC<ForgetPasswordCardProps> = ({
  email,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<SendPasscodeForm>({
    resolver: zodResolver(SendPasscodeSchema),
    defaultValues: {
      email,
      type: 'RESET_PASSWORD',
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

  const { mutateAsync: sendPasscode } = useMutation({
    mutationFn: $sendPasscode,
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
          Password reset link will be sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => sendPasscode({ json }))}
            method="POST"
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="email@example.com"
                      autoComplete="email"
                      type="email"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {turnstile}
            <Button variant="link" size="sm" className="p-0" asChild>
              <Link href="/sign-up">Not signed up? Sign up now.</Link>
            </Button>
            <Button
              className="w-full"
              type="submit"
              loading={isSubmitting}
              disabled={disableNext}
            >
              Reset Password
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

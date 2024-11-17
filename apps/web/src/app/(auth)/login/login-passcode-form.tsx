'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';

import { Button } from '@hexa/ui/button';

import {
  SendPasscodeSchema,
  type SendPasscodeType,
} from '@/features/passcode/schema';

import { useTurnstile } from '@/components/hooks/use-turnstile';
import { setFormError } from '@/lib/form';
import { $sendPasscode, type InferApiResponseType } from '@/server/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { Input } from '@hexa/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface LoginPasscodeProps {
  onPassword: () => void;
  onSuccess?: (data: InferApiResponseType<typeof $sendPasscode>) => void;
}

export function LoginPasscode({ onPassword, onSuccess }: LoginPasscodeProps) {
  const form = useForm<SendPasscodeType>({
    resolver: zodResolver(SendPasscodeSchema),
    defaultValues: {
      type: 'LOGIN_PASSCODE',
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
  });

  const mutation = useMutation({
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
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Log In</CardTitle>
          <CardDescription>We'll send you a passcode to login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((json) => mutation.mutateAsync({ json }))}
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
                        placeholder="email@example.com"
                        autoComplete="email"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button
                variant="ghost"
                className="w-full"
                key="cancel"
                onClick={onPassword}
              >
                Back
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

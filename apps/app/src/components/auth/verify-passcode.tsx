'use client';

import { useTurnstile } from '@/hooks/use-turnstile';
import { RESEND_VERIFY_CODE_TIME_SPAN, VERIFY_CODE_LENGTH } from '@/lib/const';
import { setFormError } from '@/lib/form';
import {
  type ResendPasscodeType,
  type VerifyPasscodeOnlyCodeType,
  VerifyPasscodeSchema,
  type VerifyPasscodeType,
} from '@/server/schema/passcode';
import { TurnstileSchema, type TurnstileType } from '@/server/schema/turnstile';
import { Button } from '@hexa/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { Form, FormControl, FormField, FormItem } from '@hexa/ui/form';
import { FormErrorMessage } from '@hexa/ui/form-error-message';
import { PencilLine } from '@hexa/ui/icons';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@hexa/ui/input-otp';
import { cn } from '@hexa/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { type FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCountdown } from 'usehooks-ts';

export interface VerifyPasscodeProps {
  email: string;
  passcodeId: string;
  showEmail?: boolean;
  onSuccess?: (data: unknown) => void;
  onCancel?: () => void;
  className?: string;
  onVerify: (data: VerifyPasscodeOnlyCodeType) => Promise<unknown>;
  onResend: (data: ResendPasscodeType) => Promise<unknown>;
}

export const VerifyPasscode: FC<VerifyPasscodeProps> = ({
  email,
  passcodeId,
  showEmail = true,
  onSuccess,
  onCancel,
  className,
  onVerify,
  onResend,
}) => {
  const [showResendChange, setShowResendChange] = useState(false);

  const form = useForm<VerifyPasscodeType>({
    resolver: zodResolver(VerifyPasscodeSchema),
    defaultValues: {
      code: '',
      id: passcodeId,
    },
  });

  const turnstileForm = useForm<TurnstileType>({
    resolver: zodResolver(TurnstileSchema),
  });
  const { resetTurnstile, turnstile } = useTurnstile({
    form: turnstileForm,
    onSuccess: () => {
      resendPasscode({ ...turnstileForm.getValues(), id: passcodeId });
      resetTurnstile();
      setShowResendChange(false);
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: RESEND_VERIFY_CODE_TIME_SPAN.seconds(),
  });

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const { mutateAsync: execVerifyCode } = useMutation({
    mutationFn: onVerify,
    onSuccess,
    onError: (error: Error) => {
      setFormError(error, setError, 'root', true);
    },
  });

  const { mutateAsync: resendPasscode, isPending: isRensedPending } =
    useMutation({
      mutationFn: onResend,
      onSuccess: () => {
        resetCountdown();
        startCountdown();
        reset();
      },
      onError: (error: Error) => {
        setFormError(error, setError, 'root', true);
      },
    });

  const resed = () => {
    if (count > 0) {
      return;
    }
    if (isRensedPending) {
      return;
    }

    setShowResendChange(true);
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2 text-center">
        <CardTitle>Verify Code</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email
        </CardDescription>
        {email && showEmail ? (
          <CardDescription
            className="flex items-end justify-center hover:cursor-pointer"
            onClick={onCancel}
          >
            {email}&nbsp;
            <PencilLine className="h-4 w-4" aria-hidden="true" />
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => execVerifyCode(json))}
            ref={formRef}
            method="POST"
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* @ts-ignore */}
                    <InputOTP
                      maxLength={VERIFY_CODE_LENGTH}
                      autoFocus
                      {...field}
                      containerClassName="justify-center"
                      onComplete={handleSubmit((json) => execVerifyCode(json))}
                    >
                      {[...new Array(VERIFY_CODE_LENGTH).keys()].map(
                        (index) => (
                          <InputOTPGroup key={index}>
                            <InputOTPSlot
                              index={index}
                              className={
                                errors.code || errors.root
                                  ? 'border-destructive'
                                  : ''
                              }
                            />
                          </InputOTPGroup>
                        )
                      )}
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormErrorMessage message={errors.root?.message} />
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <p
              className={cn(
                'mt-2 text-center font-medium text-primary text-sm hover:cursor-pointer hover:underline hover:underline-offset-4',
                {
                  'opacity-70': count > 0 || showResendChange,
                  'hover:cursor-not-allowed': count > 0 || showResendChange,
                }
              )}
              onClick={resed}
            >
              Didn't receive a code? Resend
              {count > 0
                ? `(${count}s)`
                : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                  isRensedPending
                  ? '...'
                  : ''}
            </p>
            {showResendChange ? turnstile : null}
          </form>
        </Form>
      </CardContent>
      <CardFooter className={cn('flex gap-2', 'flex-col')}>
        <Button className="w-full" loading={isSubmitting} type="submit">
          Verify
        </Button>
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

"use client";

import { resendVerifyEmailAction } from "@/lib/actions/sign-up";

import { useServerAction } from "zsa-react";

import { useForm } from "react-hook-form";
import { OTPForm, OTPSchema } from "@/lib/zod/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useRef } from "react";
import { VERIFY_CODE_LENGTH, RESEND_VERIFY_CODE_TIME_SPAN } from "@/lib/const";
import { useCountdown } from "usehooks-ts";
import { cn } from "@hexa/utils";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@hexa/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@hexa/ui/form";
import { PencilLine } from "@hexa/ui/icons";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@hexa/ui/input-otp";
import {
  VerifyEmailByCodeActionInput,
  VerifyEmailByCodeActionReturnType,
} from "@/lib/actions/user";

export interface VerifyEmailProps {
  email: string;
  showEmail?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
  isMobile?: boolean;
  className?: string;
  onVerify: (
    input: VerifyEmailByCodeActionInput,
  ) => VerifyEmailByCodeActionReturnType;
}

export const VerifyEmail: FC<VerifyEmailProps> = ({
  email,
  showEmail = true,
  onCancel,
  onSuccess,
  className,
  isMobile = true,
  onVerify,
}) => {
  const form = useForm<OTPForm>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      code: "",
      email: email,
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
  }, []);

  const { execute: execVerify } = useServerAction(onVerify, {
    onError: ({ err }) => {
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof OTPForm, { message: message[0] });
          }
        });
        if (err.formErrors?.length) {
          setError("code", { message: err.formErrors[0] });
        }
      } else {
        setError("code", { message: err.message });
      }
      reset(undefined, { keepErrors: true });
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const { execute: execResend, isPending: isRensedPending } = useServerAction(
    resendVerifyEmailAction,
    {
      onError: ({ err }) => {
        setError("code", { message: err.message });
      },
    },
  );

  const resed = async () => {
    if (count > 0) return;
    if (isRensedPending) return;
    const [data, error] = await execResend({ email });
    if (data) {
      resetCountdown();
      startCountdown();
      reset();
      console.log(JSON.stringify(data));
    } else {
      console.log(error);
      setError("code", { message: error?.message });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(execVerify)}
        ref={formRef}
        method="POST"
        className="space-y-4"
      >
        <Card className={cn(className)}>
          <CardHeader className="text-center pb-2">
            <CardTitle>Verify Email</CardTitle>
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
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={VERIFY_CODE_LENGTH}
                      autoFocus
                      {...field}
                      containerClassName="justify-center"
                      onComplete={handleSubmit(execVerify)}
                    >
                      {[...Array(VERIFY_CODE_LENGTH).keys()].map((index) => (
                        <InputOTPGroup key={index}>
                          <InputOTPSlot
                            index={index}
                            className={
                              errors.code || errors.root
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </InputOTPGroup>
                      ))}
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <p
              className={cn(
                "mt-2 font-medium text-sm text-primary hover:underline hover:underline-offset-4 hover:cursor-pointer text-center",
                {
                  "opacity-70": count > 0,
                },
              )}
              onClick={resed}
            >
              Didn't receive a code? Resend{" "}
              {count > 0 ? `(${count}s)` : isRensedPending ? "..." : ""}
            </p>
          </CardContent>
          <CardFooter
            className={cn(
              "flex gap-2",
              !isMobile ? "flex-row-reverse justify-end" : "flex-col",
            )}
          >
            <Button
              className={!isMobile ? "w-fit" : "w-full"}
              loading={isSubmitting}
              type="submit"
            >
              Verify
            </Button>
            <Button
              variant="outline"
              className={!isMobile ? "w-fit" : "w-full"}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
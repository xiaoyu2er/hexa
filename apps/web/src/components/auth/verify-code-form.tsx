"use client";

import type {
  ResendCodeActionInput,
  ResendCodeActionReturnType,
} from "@/lib/actions/sign-up";

import { useServerAction } from "zsa-react";

import { RESEND_VERIFY_CODE_TIME_SPAN, VERIFY_CODE_LENGTH } from "@/lib/const";
import { type OTPForm, OTPSchema } from "@/lib/zod/schemas/auth";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@hexa/ui/form";
import { PencilLine } from "@hexa/ui/icons";
import { cn } from "@hexa/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useCountdown } from "usehooks-ts";

import type {
  VerifyCodeActionInput,
  VerifyCodeActionReturnData,
  VerifyCodeActionReturnType,
} from "@/lib/actions/reset-password";
import type { VerifyEmailByCodeReturnType } from "@/lib/actions/user";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@hexa/ui/input-otp";

export interface VerifyCodeProps {
  email: string;
  showEmail?: boolean;
  onSuccess?: (_data: VerifyCodeActionReturnData) => void;
  onCancel?: () => void;
  className?: string;
  onVerify: (
    _input: VerifyCodeActionInput,
  ) => VerifyCodeActionReturnType | VerifyEmailByCodeReturnType;
  onResend: (_input: ResendCodeActionInput) => ResendCodeActionReturnType;
}

export const VerifyCode: FC<VerifyCodeProps> = ({
  email,
  showEmail = true,
  onSuccess,
  onCancel,
  className,
  onVerify,
  onResend,
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
  }, [startCountdown]);

  const { execute: execVerify } = useServerAction(onVerify, {
    onError: ({ err }) => {
      if (err.code === "INPUT_PARSE_ERROR") {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          if (message) {
            setError(field as keyof OTPForm, { message: message[0] });
          }
        }
        if (err.formErrors?.length) {
          setError("code", { message: err.formErrors[0] });
        }
      } else {
        setError("code", { message: err.message });
      }
      reset(undefined, { keepErrors: true });
    },
    onSuccess: ({ data }) => {
      onSuccess?.(data);
    },
  });

  const { execute: execResend, isPending: isRensedPending } = useServerAction(
    onResend,
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
    <Card className={cn(className)}>
      <CardHeader className="text-center pb-2">
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
            onSubmit={handleSubmit(execVerify)}
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
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className={cn("flex gap-2", "flex-col")}>
        <Button className={"w-full"} loading={isSubmitting} type="submit">
          Verify
        </Button>
        <Button variant="outline" className={"w-full"} onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

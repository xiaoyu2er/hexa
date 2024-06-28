"use client";

import Link from "next/link";
import { resendVerificationEmail, verifyEmailByCode } from "@/lib/auth/actions";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingButton,
  PencilLine,
} from "@hexa/ui";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@hexa/ui";
import { useServerAction } from "zsa-react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@hexa/ui";
import { useForm } from "react-hook-form";
import { OTPForm, OTPSchema } from "@/lib/zod/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useRef } from "react";
import {
  APP_TITLE,
  VERIFY_CODE_LENGTH,
  RESEND_VERIFICATION_CODE_SECONDS,
} from "@/lib/const";
import { useCountdown } from "usehooks-ts";
import { cn } from "@hexa/utils";

export interface VerifyEmailProps {
  email: string | null | undefined;
}

export const VerifyEmail: FC<VerifyEmailProps> = ({ email }) => {
  const form = useForm<OTPForm>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      code: "",
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
    countStart: RESEND_VERIFICATION_CODE_SECONDS,
    intervalMs: 1000,
  });

  useEffect(() => {
    startCountdown();
  }, []);

  const { execute: execVerify } = useServerAction(verifyEmailByCode, {
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
  });

  const { execute: execResend, isPending: isRensedPending } = useServerAction(
    resendVerificationEmail,
    {
      onError: ({ err }) => {
        setError("code", { message: err.message });
      },
    },
  );

  const resed = async () => {
    if (count > 0) return;
    if (isRensedPending) return;
    const [data, error] = await execResend({});
    if (data) {
      console.log(data);
      resetCountdown();
      startCountdown();
      reset();
    } else {
      console.log(error);
      setError("code", { message: error?.message });
    }
  };

  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{APP_TITLE} Verify Email</CardTitle>
          <CardDescription>
            Please enter the verification code sent to your email
          </CardDescription>
          {email ? (
            <CardDescription>
              <Link href="/sign-up" className="flex items-end justify-center">
                {email}&nbsp;
                <PencilLine className="h-4 w-4" aria-hidden="true" />
              </Link>
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
              <p
                className={cn(
                  "font-medium text-sm text-primary hover:underline hover:underline-offset-4 hover:cursor-pointer text-center",
                  {
                    "opacity-70": count > 0,
                  },
                )}
                onClick={resed}
              >
                Didn't receive a code? Resend{" "}
                {count > 0 ? `(${count}s)` : isRensedPending ? "..." : ""}
              </p>
              <LoadingButton
                className="w-full"
                loading={isSubmitting}
                type="submit"
              >
                Verify
              </LoadingButton>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                asChild
              >
                <Link href="/">Cancel</Link>
              </Button>
              <Button variant={"link"} size={"sm"} className="p-0" asChild>
                <Link href={"/login"}>Have an account? Login</Link>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

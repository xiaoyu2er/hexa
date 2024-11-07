"use client";

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

import type { VerifyCodeActionReturnData } from "@/lib/actions/reset-password";
import type { client } from "@/lib/queries";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@hexa/ui/input-otp";
import { useMutation } from "@tanstack/react-query";

export interface VerifyCodeProps {
  email: string;
  showEmail?: boolean;
  onSuccess?: (_data: VerifyCodeActionReturnData) => void;
  onCancel?: () => void;
  className?: string;
  onVerify: (typeof client)["verify-login-passcode"]["$post"];
  onResend: (typeof client)["resend-passcode"]["$post"];
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

  const { mutateAsync: execVerifyCode } = useMutation({
    mutationKey: ["veryfy-code"],
    mutationFn: onVerify,
    onSuccess: async (res) => {
      if (!res.ok) {
        try {
          const err = await res.json();
          setError("root", { message: err.error });
        } catch (e) {
          setError("root", { message: `[${res.status}] ${res.statusText}` });
        }
      } else {
        onSuccess?.(await res.json());
      }
    },
    onError: (error) => {
      console.log("err", error);
    },
  });

  const { mutateAsync: execResend, isPending: isRensedPending } = useMutation({
    mutationFn: onResend,
    onSuccess: async (res) => {
      if (!res.ok) {
        try {
          const err = await res.json();
          setError("root", { message: err.error });
        } catch (e) {
          setError("root", { message: `[${res.status}] ${res.statusText}` });
        }
      } else {
        resetCountdown();
        startCountdown();
        reset();
      }
    },
    onError: (error) => {
      console.log("err", error);
    },
  });

  const resed = async () => {
    if (count > 0) return;
    if (isRensedPending) return;
    execResend({ json: { email } });
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
            onSubmit={handleSubmit((json) => execVerifyCode({ json }))}
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
                      onComplete={handleSubmit((json) =>
                        execVerifyCode({ json }),
                      )}
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

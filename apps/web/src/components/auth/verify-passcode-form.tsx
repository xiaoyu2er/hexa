"use client";

import { RESEND_VERIFY_CODE_TIME_SPAN, VERIFY_CODE_LENGTH } from "@/lib/const";
import {
  type VerifyPasscodeForm,
  VerifyPasscodeSchema,
} from "@/lib/zod/schemas/auth";
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

import { setFormError } from "@/lib/form";
import useMutation from "@/lib/queries/useMutation";
import { $rensedPasscode, $verifyPasscode } from "@/server/client";
import type { OTPType } from "@/server/db";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@hexa/ui/input-otp";
import type { InferResponseType } from "hono/client";

export interface VerifyPasscodeProps {
  email: string;
  showEmail?: boolean;
  onSuccess?: (_data: InferResponseType<typeof $verifyPasscode>) => void;
  onCancel?: () => void;
  className?: string;
  type: OTPType;
}

export const VerifyPasscode: FC<VerifyPasscodeProps> = ({
  email,
  showEmail = true,
  onSuccess,
  onCancel,
  className,
  type,
}) => {
  const form = useForm<VerifyPasscodeForm>({
    resolver: zodResolver(VerifyPasscodeSchema),
    defaultValues: {
      code: "",
      email: email,
      type,
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
    mutationFn: $verifyPasscode,
    onSuccess: async (res) => {
      onSuccess?.(await res.json());
    },
    onError: (error: Error) => {
      setFormError(error, setError);
    },
  });

  const { mutateAsync: execResend, isPending: isRensedPending } = useMutation({
    mutationFn: $rensedPasscode,
    onSuccess: async () => {
      resetCountdown();
      startCountdown();
      reset();
    },
    onError: (error: Error) => {
      setFormError(error, setError);
    },
  });

  const resed = async () => {
    if (count > 0) return;
    if (isRensedPending) return;
    execResend({ json: { email, type } });
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
                </FormItem>
              )}
            />
            <FormErrorMessage message={errors.root?.message} />

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

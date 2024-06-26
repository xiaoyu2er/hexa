"use client";

import { useTurnstile } from "@/hooks/use-turnstile";
import { forgetPasswordAction } from "@/lib/auth/actions/reset-password";
import {
  ForgetPasswordForm,
  ForgetPasswordSchema,
} from "@/lib/zod/schemas/auth";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@hexa/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@hexa/ui/form";
import { Input } from "@hexa/ui/input";
import { LoadingButton } from "@hexa/ui/loading-button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export interface ForgetPasswordCardProps {
  email: string;
  onSuccess: (data: { email: string }) => void;
  onCancel?: () => void;
}

export const ForgetPasswordCard: FC<ForgetPasswordCardProps> = ({
  email,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<ForgetPasswordForm>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email,
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
    errorField: "email",
  });

  const { execute } = useServerAction(forgetPasswordAction, {
    onError: ({ err }) => {
      console.error("sign-up", err);
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof ForgetPasswordForm, {
              message: message[0],
            });
          }
        });
        if (err.formErrors?.length) {
          setError("email", { message: err.formErrors[0] });
        }
      } else {
        setError("email", { message: err.message });
      }
      resetTurnstile();
    },
    onSuccess: ({ data }) => {
      onSuccess?.(data);
    },
  });

  useEffect(() => {
    setFocus("email");
  }, []);

  return (
    <Card className="max-w-full md:w-96">
      <CardHeader className="text-center">
        <CardTitle>Forget Password?</CardTitle>
        <CardDescription>
          Password reset link will be sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((form) => execute(form))}
            method="POST"
            className="space-y-4"
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
                      className={errors.email ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {turnstile}
            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={"/sign-up"}>Not signed up? Sign up now.</Link>
            </Button>
            <LoadingButton
              className="w-full"
              type="submit"
              loading={isSubmitting}
              disabled={disableNext}
            >
              Reset Password
            </LoadingButton>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

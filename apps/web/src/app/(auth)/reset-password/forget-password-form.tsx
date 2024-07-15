"use client";

import { useTurnstile } from "@/hooks/use-turnstile";
import { forgetPasswordAction } from "@/lib/actions/reset-password";
import {
  type ForgetPasswordForm,
  ForgetPasswordSchema,
} from "@/lib/zod/schemas/auth";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { Input } from "@hexa/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export interface ForgetPasswordCardProps {
  email: string;
  onSuccess: (_data: { email: string }) => void;
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
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          if (message) {
            setError(field as keyof ForgetPasswordForm, {
              message: message[0],
            });
          }
        }
        if (err.formErrors?.length) {
          setError("email", { message: err.formErrors[0] });
        }
      } else {
        setError("email", { message: err.message });
      }
      resetTurnstile();
    },
    onSuccess: ({ data }) => {
      console.log("Forget password success", data);
      onSuccess?.(data);
    },
  });

  useEffect(() => {
    setFocus("email");
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
            onSubmit={handleSubmit((form) => execute(form))}
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

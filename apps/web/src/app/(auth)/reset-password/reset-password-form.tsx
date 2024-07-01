"use client";

import { resetPasswordAction } from "@/lib/auth/actions/reset-password";
import {
  ForgetPasswordForm,
  ResetPasswordForm,
  ResetPasswordSchema,
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
import { LoadingButton } from "@hexa/ui/loading-button";
import { PasswordInput } from "@hexa/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export interface ResetParsswordCardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  email: string;
  token: string;
}

export const ResetPasswordCard: FC<ResetParsswordCardProps> = ({
  onSuccess,
  onCancel,
  token,
  email,
}) => {
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      token,
      email,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;
  const { execute } = useServerAction(resetPasswordAction, {
    onError: ({ err }) => {
      console.error("resetPasswordAction", err);
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof ResetPasswordForm, {
              message: message[0],
            });
          }
        });
        if (err.formErrors?.length) {
          setError("password", { message: err.formErrors[0] });
        }
      } else {
        setError("password", { message: err.message });
      }
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  useEffect(() => {
    setFocus("password");
  }, []);

  return (
    <Card className="max-w-full md:w-96">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter a new password for your account.
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      autoComplete="current-password"
                      placeholder="********"
                      className={errors.password ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={"/sign-up"}>Not signed up? Sign up now.</Link>
            </Button>
            <LoadingButton
              className="w-full"
              type="submit"
              loading={isSubmitting}
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

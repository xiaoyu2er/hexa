"use client";

import { resetPasswordAction } from "@/lib/actions/reset-password";
import { setFormError, setFormError3 } from "@/lib/form";
import {
  type ResetPasswordForm,
  ResetPasswordSchema,
} from "@/lib/zod/schemas/auth";
import { $resetPassword } from "@/server/client";
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
import { useMutation } from "@tanstack/react-query";

import { PasswordInput } from "@hexa/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

export interface ResetParsswordCardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  token?: string;
}

export const ResetPassword: FC<ResetParsswordCardProps> = ({
  onSuccess,
  onCancel,
  token,
}) => {
  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      token,
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { mutateAsync: resetPassword } = useMutation({
    mutationFn: $resetPassword,
    onSuccess: () => {
      router.push("/settings");
    },
    onError: (error) => {
      // resetTurnstile();
      setFormError(error, setError);
    },
  });

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((json) => resetPassword({ json }))}
            method="POST"
            className="space-y-2"
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
            <Button className="w-full" type="submit" loading={isSubmitting}>
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

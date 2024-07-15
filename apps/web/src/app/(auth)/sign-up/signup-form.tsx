"use client";

import { signupAction } from "@/lib/actions/sign-up";
import Link from "next/link";

import { type SignupForm, SignupSchema } from "@/lib/zod/schemas/auth";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { Divider } from "@hexa/ui/divider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { Input } from "@hexa/ui/input";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { useTurnstile } from "@/hooks/use-turnstile";
import { PasswordInput } from "@hexa/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignupProps {
  email: string | null | undefined;
  onSuccess: (_data: { email: string }) => void;
  onCancel?: () => void;
}

export const Signup: FC<SignupProps> = ({ email, onSuccess, onCancel }) => {
  const form = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
      username: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;
  const { resetTurnstile, turnstile, disableNext } = useTurnstile({ form });
  const { execute } = useServerAction(signupAction, {
    onError: ({ err }) => {
      console.error("sign-up", err);
      if (err.code === "INPUT_PARSE_ERROR") {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          if (message) {
            setError(field as keyof SignupForm, { message: message[0] });
          }
        }
        if (err.formErrors?.length) {
          setError("root", { message: err.formErrors[0] });
        }
      } else {
        console.log("err", err);
        setError("root", { message: err.message });
      }
      resetTurnstile();
    },
    onSuccess: ({ data }) => {
      console.log("sign-up", data);
      onSuccess?.(data);
    },
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <OAuthButtons />
        <Divider>or</Divider>
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

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="username"
                      className={errors.username ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
            <FormErrorMessage message={errors.root?.message} />
            {turnstile}
            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={"/login"}>Have an account? Login</Link>
            </Button>
            <Button
              className="w-full"
              type="submit"
              loading={isSubmitting}
              disabled={disableNext}
            >
              Sign Up
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

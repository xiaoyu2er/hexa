"use client";

import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";

import { Button } from "@hexa/ui/button";

import {
  type LoginPasswordInput,
  LoginPasswordSchema,
} from "@/lib/zod/schemas/auth";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { useTurnstile } from "@/hooks/use-turnstile";
import { client } from "@/lib/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { Divider } from "@hexa/ui/divider";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { Input } from "@hexa/ui/input";
import { PasswordInput } from "@hexa/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { InferRequestType } from "hono";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface LoginPasswordProps {
  onPasscode: () => void;
}

export function LoginPassword({ onPasscode }: LoginPasswordProps) {
  const router = useRouter();

  const form = useForm<LoginPasswordInput>({
    resolver: zodResolver(LoginPasswordSchema),
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { resetTurnstile, turnstile, disableNext } = useTurnstile({
    form,
    onSuccess: () => {
      clearErrors("root");
    },
  });
  const $login = client.login.$post;

  const mutation = useMutation<
    Response,
    Error,
    InferRequestType<typeof $login>["form"]
  >({
    mutationFn: async (form) => {
      console.log("form", form);
      return $login({ form });
    },
    onSuccess: async (res) => {
      if (!res.ok) {
        const err = await res.json();
        setError("root", { message: err.error });
        resetTurnstile();
      } else {
        router.push("/settings");
      }
    },
    onError: (error) => {
      console.log("err", error);
      resetTurnstile();
    },
  });

  useEffect(() => {
    setFocus("username");
  }, [setFocus]);

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Log in to your account to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButtons />
          <Divider>or</Divider>
          <Form {...form}>
            <form
              onSubmit={handleSubmit((form) => {
                // @ts-ignore
                return mutation.mutate(form);
              })}
              method="POST"
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        autoComplete="email"
                        {...field}
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

              <div className="flex flex-wrap justify-between">
                <Button variant={"link"} size={"sm"} className="p-0" asChild>
                  <Link href={"/sign-up"}>Not signed up? Sign up now.</Link>
                </Button>
                <Button variant={"link"} size={"sm"} className="p-0" asChild>
                  <Link href={"/reset-password"}>Forget password?</Link>
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={disableNext}
                key="login"
              >
                Login
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                key="cancel"
                onClick={onPasscode}
              >
                Login with Passcode
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

"use client";

import Link from "next/link";

import { loginPasswordAction } from "@/lib/actions/login";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

interface LoginPasswordProps {
  onPasscode: () => void;
}

export function LoginPassword({ onPasscode }: LoginPasswordProps) {
  const form = useForm<LoginPasswordInput>({
    resolver: zodResolver(LoginPasswordSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;

  const { resetTurnstile, turnstile, disableNext } = useTurnstile({
    form,
  });

  const { execute } = useServerAction(loginPasswordAction, {
    onError: ({ err }) => {
      if (err.code === "INPUT_PARSE_ERROR") {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          if (message) {
            setError(field as keyof LoginPasswordInput, {
              message: message[0],
            });
          }
        }
        if (err.formErrors?.length) {
          setError("root", { message: err.formErrors[0] });
        }
      } else {
        setError("root", { message: err.message });
      }

      resetTurnstile();
    },
  });
  useEffect(() => {
    setFocus("email");
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
                        placeholder="email@example.com"
                        autoComplete="email"
                        {...field}
                        type="email"
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

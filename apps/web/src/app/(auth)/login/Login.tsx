"use client";

import Link from "next/link";

import { loginAction } from "@/lib/auth/actions/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui/form";

import { Button } from "@hexa/ui/button";

import { LoginForm, LoginSchema, SignupForm } from "@/lib/zod/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { DiscordLogoIcon } from "@hexa/ui/icons";
import { PasswordInput } from "@hexa/ui/password-input";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { LoadingButton } from "@hexa/ui/loading-button";
import { Divider } from "@hexa/ui/divider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { Input } from "@hexa/ui/input";

const APP_TITLE = "Hexa";

export function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;
  const { execute } = useServerAction(loginAction, {
    onError: ({ err }) => {
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof SignupForm, { message: message[0] });
          }
        });
        if (err.formErrors?.length) {
          setError("root", { message: err.formErrors[0] });
        }
      } else {
        setError("root", { message: err.message });
      }
    },
  });
  useEffect(() => {
    setFocus("email");
  }, []);

  return (
    <Card className="max-w-full md:w-96">
      <CardHeader className="text-center">
        <CardTitle>{APP_TITLE} Log In</CardTitle>
        <CardDescription>
          Log in to your account to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login/discord">
            <DiscordLogoIcon className="mr-2 h-5 w-5" />
            Log in with Discord
          </Link>
        </Button>
        <Divider>or</Divider>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((form) => execute(form))}
            method="POST"
            className="grid gap-4"
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

            <div className="flex flex-wrap justify-between">
              <Button variant={"link"} size={"sm"} className="p-0" asChild>
                <Link href={"/sign-up"}>Not signed up? Sign up now.</Link>
              </Button>
              <Button variant={"link"} size={"sm"} className="p-0" asChild>
                <Link href={"/reset-password"}>Forgot password?</Link>
              </Button>
            </div>

            <LoadingButton
              type="submit"
              className="w-full"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { signupAction } from "@/lib/actions/sign-up";

import { useServerAction } from "zsa-react";
import { useForm } from "react-hook-form";
import { SignupForm, SignupSchema } from "@/lib/zod/schemas/auth";
import { FC, useEffect } from "react";
import { Button } from "@hexa/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@hexa/ui/card";
import { Divider } from "@hexa/ui/divider";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@hexa/ui/form";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { GithubIcon, GoogleIcon } from "@hexa/ui/icons";
import { Input } from "@hexa/ui/input";
import { LoadingButton } from "@hexa/ui/loading-button";
import { PasswordInput } from "@hexa/ui/password-input";
import { useTurnstile } from "@/hooks/use-turnstile";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignupProps {
  email: string | null | undefined;
  onSuccess: (data: { email: string }) => void;
  onCancel?: () => void;
}

export const Signup: FC<SignupProps> = ({ email, onSuccess, onCancel }) => {
  const form = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: email ?? "",
      password: "",
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
      resetTurnstile();
    },
    onSuccess: ({ data }) => {
      console.log("sign-up", data);
      onSuccess?.(data);
    },
  });

  useEffect(() => {
    setFocus("email");
  }, []);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/oauth/github">
              <GithubIcon className="mr-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/oauth/google">
              <GoogleIcon className="mr-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <Divider>or</Divider>
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
            <LoadingButton
              className="w-full"
              type="submit"
              loading={isSubmitting}
              disabled={disableNext}
            >
              Sign Up
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

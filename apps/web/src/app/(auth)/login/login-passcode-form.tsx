"use client";

import { loginPasscodeAction } from "@/lib/actions/login";
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
  type LoginPasscodeInput,
  LoginPasscodeSchema,
} from "@/lib/zod/schemas/auth";

import { useTurnstile } from "@/hooks/use-turnstile";
import { setFormError } from "@/lib/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { Input } from "@hexa/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

interface LoginPasscodeProps {
  onPassword: () => void;
  onSuccess?: (_data: { email: string }) => void;
}

export function LoginPasscode({ onPassword, onSuccess }: LoginPasscodeProps) {
  const form = useForm<LoginPasscodeInput>({
    resolver: zodResolver(LoginPasscodeSchema),
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

  const { execute } = useServerAction(loginPasscodeAction, {
    onError: ({ err }) => {
      setFormError(err, setError);
      resetTurnstile();
    },
    onSuccess: ({ data }) => {
      onSuccess?.(data);
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
          <CardDescription>We'll send you a passcode to login</CardDescription>
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

              <FormErrorMessage message={errors.root?.message} />

              {turnstile}

              <Button
                type="submit"
                className="w-full !mt-4"
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
                onClick={onPassword}
              >
                Back
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

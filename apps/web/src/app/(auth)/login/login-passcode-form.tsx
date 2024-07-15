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
  LoginPasscodeSchema,
  LoginPasscodeInput,
} from "@/lib/zod/schemas/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { Input } from "@hexa/ui/input";
import { useTurnstile } from "@/hooks/use-turnstile";

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
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof LoginPasscodeInput, {
              message: message[0],
            });
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

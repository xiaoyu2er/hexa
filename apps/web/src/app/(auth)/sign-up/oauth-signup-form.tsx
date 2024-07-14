"use client";

import { oauthSignupAction } from "@/lib/actions/sign-up";

import { OAuthSignupInput, OAuthSignupSchema } from "@/lib/zod/schemas/auth";
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
import { FormErrorMessage } from "@hexa/ui/form-error-message";
import { Input } from "@hexa/ui/input";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

import { useTurnstile } from "@/hooks/use-turnstile";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";

interface OAuthSignupProps {
  oauthAccountId: string | undefined;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const OAuthSignup: FC<OAuthSignupProps> = ({
  oauthAccountId,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<OAuthSignupInput>({
    resolver: zodResolver(OAuthSignupSchema),
    defaultValues: {
      oauthAccountId,
      username: "",
    },
  });

  const {
    handleSubmit,
    setError,
    register,
    formState: { isSubmitting, errors },
    setFocus,
  } = form;
  const { resetTurnstile, turnstile, disableNext } = useTurnstile({ form });
  const { execute } = useServerAction(oauthSignupAction, {
    onError: ({ err }) => {
      console.error("sign-up", err);
      if (err.code === "INPUT_PARSE_ERROR") {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof OAuthSignupInput, { message: message[0] });
          }
        });
        if (err.formErrors?.length) {
          setError("root", { message: err.formErrors[0] });
        }
      } else {
        console.log("err", err);
        setError("root", { message: err.message });
      }
      resetTurnstile();
    },
    onSuccess: () => {
      console.log("oauth-sign-up");
      toast.success("Sign up success");
      onSuccess?.();
    },
  });

  useEffect(() => {
    setFocus("username");
  }, []);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>OAuth Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((form) => execute(form))}
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" {...register("oauthAccountId")} />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=""
                      className={errors.username ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormErrorMessage message={errors.root?.message} />
            {turnstile}

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

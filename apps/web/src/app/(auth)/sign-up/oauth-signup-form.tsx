"use client";

import { oauthSignupAction } from "@/lib/actions/sign-up";

import {
  type OAuthSignupInput,
  OAuthSignupSchema,
} from "@/lib/zod/schemas/auth";
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
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";

import { useTurnstile } from "@/hooks/use-turnstile";
import type { OAuthAccountModel } from "@/lib/db";
import { setFormError } from "@/lib/form";
import { toast } from "@hexa/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

interface OAuthSignupProps {
  oauthAccount: OAuthAccountModel;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const OAuthSignup: FC<OAuthSignupProps> = ({
  oauthAccount,
  onSuccess,
  onCancel,
}) => {
  const form = useForm<OAuthSignupInput>({
    resolver: zodResolver(OAuthSignupSchema),
    defaultValues: {
      oauthAccountId: oauthAccount.id,
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
      setFormError(err, setError);
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
  }, [setFocus]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Create your username to start using the app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit((form) => execute(form))}
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" {...register("oauthAccountId")} />
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input value={oauthAccount.email} type="email" disabled />
            </FormItem>
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

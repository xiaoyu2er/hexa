"use client";

import Link from "next/link";
import { signupAction } from "@/lib/auth/actions/sign-up.action";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DiscordLogoIcon,
  Divider,
  FormErrorMessage,
  Input,
  LoadingButton,
  PasswordInput,
} from "@hexa/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@hexa/ui";
import { useServerAction } from "zsa-react";
import { useForm } from "react-hook-form";
import { SignupForm } from "@/lib/zod/schemas/auth";
import { APP_TITLE } from "@/lib/const";
import { FC, useEffect } from "react";

interface SignupProps {
  email: string | null | undefined;
}

export const Signup: FC<SignupProps> = ({ email }) => {
  const form = useForm<SignupForm>({
    // resolver: zodResolver(SignupSchema),
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
    },
  });

  useEffect(() => {
    setFocus("email");
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{APP_TITLE} Sign Up</CardTitle>
        <CardDescription>Sign up to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login/discord">
            <DiscordLogoIcon className="mr-2 h-5 w-5" />
            Sign up with Discord
          </Link>
        </Button>
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
            <Button variant={"link"} size={"sm"} className="p-0" asChild>
              <Link href={"/login"}>Have an account? Login</Link>
            </Button>
            <LoadingButton
              className="w-full"
              type="submit"
              loading={isSubmitting}
            >
              Sign Up
            </LoadingButton>
            <Button variant="outline" className="w-full" type="button" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

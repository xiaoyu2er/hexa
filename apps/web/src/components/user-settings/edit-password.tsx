"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";

import { APP_TITLE } from "@/lib/const";
import { queryUserEmailsOptions, queryUserOptions } from "@/lib/queries/user";
import { Button } from "@hexa/ui/button";
import { Input } from "@hexa/ui/input";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

export function EditPassword() {
  const { data: user } = useSuspenseQuery(queryUserOptions);
  const { data: emails } = useSuspenseQuery(queryUserEmailsOptions);
  const primaryEmail = emails?.find((email) => email.primary);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        {!user.hasPassword ? (
          <CardDescription>
            Set a password to have an alternative way to log into your{" "}
            {process.env.NEXT_PUBLIC_APP_NAME} account using your username (
            {user.username}){" "}
            {primaryEmail ? `or email (${primaryEmail.email})` : ""}
          </CardDescription>
        ) : (
          <CardDescription>
            Strengthen your account by ensuring your password is strong.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Input placeholder="********" className="max-w-md" disabled />
      </CardContent>
      <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between">
        <Button type="submit" className="shrink-0" asChild>
          <Link href="/reset-password">
            {user.hasPassword ? "Update" : "Set"} password{" "}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

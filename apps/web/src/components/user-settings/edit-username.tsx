"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { Input } from "@hexa/ui/input";
import { CopyButton } from "@hexa/ui/copy-button";
import { queryUserOptions } from "@/lib/queries/user";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@hexa/ui/button";
import { useModal } from "@ebay/nice-modal-react";
import { ChangeUsernameModal } from "./change-username-modal";

export function EditUsername() {
  const { data: user, refetch } = useSuspenseQuery(queryUserOptions);
  const modal = useModal(ChangeUsernameModal);

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>
          Your username is how other people on{" "}
          {process.env.NEXT_PUBLIC_APP_NAME} will identify you. Changing your
          username can have unintended side effects.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <Input
          type="text"
          value={user.username}
          className="w-full md:max-w-md"
          onClick={() => {}}
        />
        <CopyButton className="relative right-9" value={user.username} />
      </CardContent>
      <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between">
        <Button
          variant="secondary"
          className="shrink-0"
          onClick={() => {
            modal.show().then(() => {
              refetch();
            });
          }}
        >
          Change username
        </Button>
      </CardFooter>
    </Card>
  );
}

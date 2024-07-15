"use client";

import { queryUserOptions } from "@/lib/queries/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@hexa/ui/card";
import { CopyButton } from "@hexa/ui/copy-button";
import { Input } from "@hexa/ui/input";
import { useSuspenseQuery } from "@tanstack/react-query";

export function UserId() {
  const { data: user } = useSuspenseQuery(queryUserOptions);

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Your User ID</CardTitle>
        <CardDescription>
          This is your unique account identifier on{" "}
          {process.env.NEXT_PUBLIC_APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <Input
          type="text"
          value={user?.id}
          className="w-full md:max-w-md"
          onClick={() => {}}
        />
        <CopyButton className="relative right-9" value={user.id} />
      </CardContent>
    </Card>
  );
}

"use client";

import { useSession } from "@/app/session-provider";
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

export function UserId() {
  const { user } = useSession();

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
        <Input type="text" value={user?.id} className="max-w-md" />
        <CopyButton className="relative right-9" value={user.id} />
      </CardContent>
      <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between"></CardFooter>
    </Card>
  );
}

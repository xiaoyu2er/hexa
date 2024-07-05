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
import { WorkspaceModel } from "@/lib/db";

export async function WorkspaceId({ ws }: { ws: WorkspaceModel }) {
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Workspace ID</CardTitle>
        <CardDescription>
          This is the unique workspace identifier on{" "}
          {process.env.NEXT_PUBLIC_APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <Input type="text" value={ws.id} className="max-w-md" />
        <CopyButton className="relative right-9" value={ws.id} />
      </CardContent>
      <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between"></CardFooter>
    </Card>
  );
}

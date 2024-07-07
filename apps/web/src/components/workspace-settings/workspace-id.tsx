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
import { queryWorkspaceBySlugOptions } from "@/lib/queries/workspace";
import { useSuspenseQuery } from "@tanstack/react-query";

export async function WorkspaceId({ slug }: { slug: string }) {
  const { data: ws } = useSuspenseQuery(queryWorkspaceBySlugOptions(slug));
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
        <Input
          type="text"
          value={ws?.id}
          className="w-full md:max-w-md"
          onClick={() => {}}
        />
        <CopyButton className="relative right-9" value={ws.id} />
      </CardContent>
      <CardFooter className="border-t px-6 py-4 items-center flex-row-reverse justify-between"></CardFooter>
    </Card>
  );
}

'use client';

import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { queryWorkspaceBySlugOptions } from '@/lib/queries/workspace';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { CopyButton } from '@hexa/ui/copy-button';
import { Input } from '@hexa/ui/input';
import { useSuspenseQuery } from '@tanstack/react-query';

export function WorkspaceId({ slug }: { slug: string }) {
  const { data: ws } = useSuspenseQuery(queryWorkspaceBySlugOptions(slug));
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Workspace ID</CardTitle>
        <CardDescription>
          This is the unique workspace identifier on {NEXT_PUBLIC_APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <Input type="text" value={ws?.id} className="w-full md:max-w-md" />
        <CopyButton className="relative right-9" value={ws.id} />
      </CardContent>
      <CardFooter className="flex-row-reverse items-center justify-between border-t px-6 py-4" />
    </Card>
  );
}

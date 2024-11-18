'use client';

import { useSession } from '@/components/providers/session-provider';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';
import { CopyButton } from '@hexa/ui/copy-button';
import { Input } from '@hexa/ui/input';

export function UserId() {
  const { user } = useSession();

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Your User ID</CardTitle>
        <CardDescription>
          This is your unique account identifier on {NEXT_PUBLIC_APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <Input type="text" value={user?.id} className="w-full md:max-w-md" />
        <CopyButton className="relative right-9" value={user.id} />
      </CardContent>
    </Card>
  );
}

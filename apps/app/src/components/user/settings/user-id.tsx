'use client';

import { ReadOnly } from '@/components/form/read-only';
import { useSession } from '@/components/providers/session-provider';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

export function UserId() {
  const { user } = useSession();

  return (
    <Card>
      <CardHeader>
        <CardTitle>User ID</CardTitle>
        <CardDescription>
          This is your unique account identifier on {NEXT_PUBLIC_APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <ReadOnly text={user.id} />
      </CardContent>
    </Card>
  );
}

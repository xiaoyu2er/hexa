'use client';

import { ReadOnly } from '@/components/form/read-only';
import { useUser } from '@/hooks/use-user';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hexa/ui/card';

export function UserId() {
  const { user } = useUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>User ID</CardTitle>
        <CardDescription>
          This is your unique account identifier on {NEXT_PUBLIC_APP_NAME}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <ReadOnly text={user.id} className="md:max-w-md" />
      </CardContent>
    </Card>
  );
}

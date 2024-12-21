'use client';

import { ReadOnly } from '@/components/form';
import { useUser } from '@/hooks/use-user';
import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
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
      <CardContent>
        <ReadOnly text={user.id} className="max-w-md" />
      </CardContent>
    </Card>
  );
}

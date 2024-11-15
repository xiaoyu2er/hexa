'use client';

import { useSession } from '@/components/providers/session-provider';
import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
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
import { ChangeUsernameModal } from './change-username-modal';

export function EditUsername() {
  const { user, refetch } = useSession();
  const modal = useModal(ChangeUsernameModal);

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>
          Your username is how other people on {NEXT_PUBLIC_APP_NAME} will
          identify you. Changing your username can have unintended side effects.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <Input
          type="text"
          value={user.username}
          className="w-full md:max-w-md"
        />
        <CopyButton className="relative right-9" value={user.username} />
      </CardContent>
      <CardFooter className="flex-row-reverse items-center justify-between border-t px-6 py-4">
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

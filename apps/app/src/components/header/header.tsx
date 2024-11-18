import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { getSession } from '@/lib/session';
import { Button } from '@hexa/ui/button';
import { Loader2Icon } from '@hexa/ui/icons';
import Link from 'next/link';
import { Suspense } from 'react';
import { ModeToggle } from './mode-toggle';

async function HeaderActions() {
  const { user } = await getSession();
  const isSignedIn = !!user;

  return (
    <>
      {isSignedIn ? (
        <>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <Button asChild variant="secondary">
            <Link href={`/${user.name}/settings/profile`}>Dashboard</Link>
          </Button>
        </>
      ) : (
        <>
          <ModeToggle />
          <Button asChild variant="secondary">
            <Link href="/login">Log In</Link>
          </Button>
        </>
      )}
    </>
  );
}

export function Header() {
  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl">
            <div className="hidden md:block">{NEXT_PUBLIC_APP_NAME}</div>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-5">
          <Suspense
            fallback={
              <div className="flex w-40 items-center justify-center">
                <Loader2Icon className="h-4 w-4 animate-spin" />
              </div>
            }
          >
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

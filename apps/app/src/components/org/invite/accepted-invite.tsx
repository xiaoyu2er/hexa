'use client';

import type { SelectInviteType } from '@hexa/server/schema/org-invite';
import { Confetti, type ConfettiRef } from '@hexa/ui/confetti';
import { LogoIcon } from '@hexa/ui/icons';
import { Button, Card, Link } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function AcceptedInvite({
  invite,
  nextUrl = '/', // Default to home if not provided
}: {
  invite: SelectInviteType;
  nextUrl?: string;
}) {
  const router = useRouter();
  const confettiRef = useRef<ConfettiRef>(null);
  const [countdown, _setCountdown] = useState(5);

  useEffect(() => {
    confettiRef.current?.fire({});

    // const timer = setInterval(() => {
    //   setCountdown((prev) => {
    //     if (prev <= 1) {
    //       clearInterval(timer);
    //       router.push(nextUrl);
    //     }
    //     return prev - 1;
    //   });
    // }, 1000);

    // return () => clearInterval(timer);
  }, [nextUrl, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center">
            <LogoIcon className="w-12 h-12" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Welcome to {invite.org.name}!
            </h1>
            <p className="text-gray-600">
              You have successfully joined the organization. You can now start
              collaborating with your team.
            </p>
          </div>

          <Button color="primary" className="w-full" as={Link} href={nextUrl}>
            Get Started ({countdown}s)
          </Button>
        </div>
      </Card>
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full"
      />
    </div>
  );
}

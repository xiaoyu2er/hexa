'use client';
import { LogoIcon } from '@hexa/ui/icons';
import { Button, Card, Link } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function InvalidInvite() {
  const router = useRouter();
  const [countdown, _setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
      return;
    }

    // const timer = setInterval(() => {
    //   setCountdown((prev) => prev - 1);
    // }, 1000);

    // return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center">
            <LogoIcon className="w-12 h-12" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Invalid Invite</h1>
            <p className="text-gray-600">
              This invite link is invalid or has expired. Please ask the
              organization members to send you another invitation.
            </p>
          </div>

          <div className="w-full flex flex-col gap-2 items-center">
            <Button color="primary" className="w-full" as={Link} href="/">
              Go Home ({countdown}s)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { NEXT_PUBLIC_APP_NAME } from '@/lib/env';
import { Button } from '@hexa/ui/button';
import { ModeToggle } from '@hexa/ui/mode-toggle';
import Link from 'next/link';

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
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <Button asChild variant="secondary">
            <Link href="/user/settings/profile">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

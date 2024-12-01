import { Button } from '@hexa/ui/button';
import Link from 'next/link';
import type { ReactElement } from 'react';

export default function NotFound(): ReactElement {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 font-bold text-4xl text-gray-800">
        404 - Page Not Found
      </h1>
      <p className="mb-6 text-gray-600">
        Oops! The page you're looking for doesn't seem to exist.
      </p>

      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}

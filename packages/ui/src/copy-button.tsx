'use client';

import { Check, Copy } from '@hexa/ui/icons';
import { toast } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils';
import { useState } from 'react';
import { Button } from './ui/button';

export function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const Comp = copied ? Check : Copy;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={async (e) => {
        e.stopPropagation();

        try {
          await navigator.clipboard.writeText(value);
          toast.success('Copied to clipboard!');
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } catch (_error) {
          toast.error('Failed to copy to clipboard!');
        }
      }}
      className={cn('h-6 w-6', className)}
    >
      <span className="sr-only">Copy</span>
      <Comp className="h-4 w-4 text-gray-700 transition-all group-hover:text-blue-800" />
    </Button>
  );
}

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
      onClick={(e) => {
        e.stopPropagation();
        setCopied(true);
        navigator.clipboard.writeText(value).then(() => {
          toast.success('Copied to clipboard!');
        });
        setTimeout(() => setCopied(false), 3000);
      }}
      className={cn('h-7 w-7', className)}
    >
      <span className="sr-only">Copy</span>
      <Comp className="h-4 w-4 text-gray-700 transition-all group-hover:text-blue-800" />
    </Button>
  );
}

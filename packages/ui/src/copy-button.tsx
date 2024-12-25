'use client';

import { cn } from '@hexa/lib';
import { Check, Copy } from '@hexa/ui/icons';
import { toast } from '@hexa/ui/sonner';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

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
      variant="light"
      isIconOnly
      aria-label="Copy"
      onPress={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast.success('Copied to clipboard!');
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } catch (_error) {
          toast.error('Failed to copy to clipboard!');
        }
      }}
      className={cn('h-6 w-6 min-w-6', className)}
    >
      <Comp
        className="h-4 w-4 text-gray-700 transition-all group-hover:text-blue-800"
        strokeWidth={1.5}
      />
    </Button>
  );
}

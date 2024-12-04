'use client';

import { Button } from '@hexa/ui/button';
import { CopyIcon } from '@hexa/ui/icons';
import { toast } from '@hexa/ui/sonner';

interface CopyButtonProps {
  url: string;
  className?: string;
}

export function CopyButton({ url, className }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-6 w-6 ${className}`}
      onClick={handleCopy}
    >
      <CopyIcon className="h-4 w-4" />
    </Button>
  );
}

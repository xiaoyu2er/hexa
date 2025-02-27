import { Input } from '@heroui/react';
import { cn } from '@hexa/lib';
import { CopyButton } from '@hexa/ui/copy-button';

export function ReadOnly({
  text,
  className,
}: { text: string; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Input type="text" readOnly value={text} />
      <CopyButton
        className="-translate-y-1/2 absolute top-1/2 right-2"
        value={text}
      />
    </div>
  );
}

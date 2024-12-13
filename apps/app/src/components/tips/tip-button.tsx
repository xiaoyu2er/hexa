import { CircleHelpIcon } from '@hexa/ui/icons';
import { Button, cn } from '@nextui-org/react';
import type { ComponentProps } from 'react';
import { forwardRef } from 'react';

export const TipButton = forwardRef<
  HTMLButtonElement,
  {
    className?: string;
    'aria-label'?: string;
  } & ComponentProps<typeof Button>
>(({ className, 'aria-label': ariaLabel, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="light"
      isIconOnly
      size="sm"
      className={cn('h-4 w-4 min-w-4', className)}
      {...props}
    >
      <CircleHelpIcon
        className="h-4 w-4 text-muted-foreground"
        aria-label={ariaLabel}
      />
    </Button>
  );
});

TipButton.displayName = 'TipButton';

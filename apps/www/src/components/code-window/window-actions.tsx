import { clsx } from '@heroui/shared-utils';
import type React from 'react';
import { tv } from 'tailwind-variants';

export type WindowActionsProps = {
  title?: string;
  className?: string;
};

const windowIconStyles = tv({
  base: 'w-3 h-3 rounded-full',
  variants: {
    color: {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
    },
  },
});

export const WindowActions: React.FC<WindowActionsProps> = ({
  title,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'sticky top-0 left-0 z-10 flex h-8 w-full items-center justify-between bg-code-background px-4',
        className
      )}
      {...props}
    >
      <div className="flex basis-1/3 items-center gap-2">
        <div className={windowIconStyles({ color: 'red' })} />
        <div className={windowIconStyles({ color: 'yellow' })} />
        <div className={windowIconStyles({ color: 'green' })} />
      </div>
      <div className="flex h-full basis-1/3 items-center justify-center">
        {title && <p className="font-light text-white/30 text-xs">{title}</p>}
      </div>
      <div className="flex basis-1/3" />
    </div>
  );
};

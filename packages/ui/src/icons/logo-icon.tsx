import { Avatar } from '@nextui-org/react';
import { cn } from '../../../lib/src';

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Avatar
      className={cn('h-8 w-8', className)}
      src="https://hexacdn.com/h.png"
    />
  );
};

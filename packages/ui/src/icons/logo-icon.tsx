import { cn } from '@hexa/lib';
import { Avatar } from '@nextui-org/react';

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Avatar
      className={cn('h-6 w-6', className)}
      src="https://hexacdn.com/h.png"
    />
  );
};

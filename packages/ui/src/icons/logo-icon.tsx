import { Avatar } from '@heroui/react';
import { cn } from '@hexa/lib';

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Avatar
      className={cn('h-6 w-6', className)}
      src="https://hexacdn.com/h.png"
    />
  );
};

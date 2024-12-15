import { cn } from '@hexa/utils';
import { Avatar } from '@nextui-org/react';

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Avatar
      className={cn(
        'box-content h-8 w-8 dark:border dark:border-gray-300',
        className
      )}
      src="https://hexacdn.com/h.png"
    />
  );
};

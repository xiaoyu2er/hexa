import { Avatar, AvatarFallback, AvatarImage } from '@hexa/ui/avatar';
import { cn } from '@hexa/utils';

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Avatar
      className={cn(
        'box-content h-8 w-8 dark:border dark:border-gray-300',
        className
      )}
    >
      <AvatarImage src="https://hexacdn.com/h.png" alt="Hexa" />
      <AvatarFallback delayMs={200}>Hexa</AvatarFallback>
    </Avatar>
  );
};

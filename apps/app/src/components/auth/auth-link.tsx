import { Link, cn } from '@nextui-org/react';
import type { FC, ReactNode } from 'react';

export const AuthLink: FC<{
  href?: string;
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}> = ({ href, children, className, onPress }) => {
  return (
    <Link
      href={href}
      underline="hover"
      size="sm"
      className={cn('font-medium text-xs', className)}
      // TODO: onPress will prevent the default behavior of the link
      onClick={onPress}
    >
      {children}
    </Link>
  );
};

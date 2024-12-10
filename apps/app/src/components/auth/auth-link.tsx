import { Link, cn } from '@nextui-org/react';
import type { FC, ReactNode } from 'react';

export const AuthLink: FC<{
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ href, children, className, onClick }) => {
  return (
    <Link
      href={href}
      underline="hover"
      size="sm"
      className={cn('font-medium text-xs', className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

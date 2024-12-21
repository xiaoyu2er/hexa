import {
  CardBody,
  CardFooter as CardFooterNextui,
  CardHeader as CardHeaderNextui,
  Card as CardNextui,
} from '@nextui-org/react';
import type { HTMLAttributes, RefAttributes } from 'react';
import { cn } from '../../../lib/src';

// Basic component types
type CardProps = HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>;
type CardHeaderProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;
type CardTitleProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;
type CardDescriptionProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;
type CardContentProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;
type CardFooterProps = HTMLAttributes<HTMLDivElement> &
  RefAttributes<HTMLDivElement>;

// Updated components using new ref prop syntax
const Card = ({ className, ref, ...props }: CardProps) => (
  // @see https://nextui.org/docs/components/card#card-props
  // @ts-expect-error shadow is not a valid prop
  <CardNextui shadow="sm" className={cn(className)} {...props} />
);
Card.displayName = 'Card';

const CardHeader = ({ className, ...props }: CardHeaderProps) => (
  <CardHeaderNextui
    className={cn('flex flex-col items-stretch space-y-1.5 p-6', className)}
    {...props}
  />
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({ className, ref, ...props }: CardTitleProps) => (
  <div ref={ref} className={cn('font-semibold', className)} {...props} />
);
CardTitle.displayName = 'CardTitle';

const CardDescription = ({
  className,
  ref,
  ...props
}: CardDescriptionProps) => (
  <div
    ref={ref}
    className={cn('text-foreground-500 text-sm', className)}
    {...props}
  />
);
CardDescription.displayName = 'CardDescription';

const CardContent = ({ className, ...props }: CardContentProps) => (
  <CardBody className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = ({ className, ...props }: CardFooterProps) => (
  <CardFooterNextui
    className={cn(
      'flex-row-reverse gap-4 border-default-200 border-t px-6 py-4',
      className
    )}
    {...props}
  />
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};

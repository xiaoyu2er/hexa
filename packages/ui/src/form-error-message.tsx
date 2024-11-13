import { cn } from '@hexa/utils';
import type { FC } from 'react';
interface FormMessageProps {
  message?: string;
  className?: string;
}

export const FormErrorMessage: FC<FormMessageProps> = ({
  message,
  className,
}) => {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        'rounded-lg border bg-destructive/10 p-2 font-medium text-[0.8rem] text-destructive',
        className
      )}
    >
      {message}
    </p>
  );
};

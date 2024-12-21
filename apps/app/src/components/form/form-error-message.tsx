import type { FC } from 'react';
import { cn } from '../../../../../packages/lib/src';
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
        'flex w-full flex-grow flex-row items-start gap-x-1 rounded-medium border border-danger-200 bg-danger-50 px-4 py-2 text-danger-600 text-sm dark:border-danger-100 dark:bg-danger-50/50 dark:text-danger-500',
        className
      )}
    >
      {message}
    </p>
  );
};

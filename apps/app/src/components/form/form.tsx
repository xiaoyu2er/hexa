import type { FormEventHandler, ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: {
  form: UseFormReturn<T>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

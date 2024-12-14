import type { FormEventHandler, ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export const Form = <T extends FieldValues>({
  form,
  handleSubmit,
  children,
  className,
}: {
  form: UseFormReturn<T>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

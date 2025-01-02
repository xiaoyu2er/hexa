import type { FormEventHandler, FormHTMLAttributes, ReactNode } from 'react';
import { FormProvider } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  className?: string;
} & FormHTMLAttributes<HTMLFormElement>;

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...rest
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={className} {...rest}>
        {children}
      </form>
    </FormProvider>
  );
};

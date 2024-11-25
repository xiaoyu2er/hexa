import type { BaseFieldProps } from '@/components/form/form-type';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import { cn } from '@hexa/utils/cn';
import { get } from 'lodash';
import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';

export type InputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<'input'>, keyof BaseFieldProps<T>>;

const InputProps = {
  email: {
    placeholder: 'email@example.com',
    autoComplete: 'email',
    type: 'email',
  },
  password: {
    placeholder: '********',
    autoComplete: 'current-password',
  },
} as const;

export const InputField = <T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  type,
  formItemClassName,
  className,
  ...props
}: InputFieldProps<T>) => {
  const otherProps = InputProps[type as keyof typeof InputProps] ?? {};

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              type={type}
              {...otherProps}
              className={cn(
                get(form.formState.errors, name) ? 'border-destructive' : '',
                className
              )}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

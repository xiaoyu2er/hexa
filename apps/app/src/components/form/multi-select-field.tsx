import type { BaseFieldProps } from '@/components/form/form-type';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';

import type { SelectOptions } from '@hexa/const/select-option';
import { MultiSelect } from '@hexa/ui/multi-select';
import {} from '@hexa/ui/select';
import { cn } from '@hexa/utils';
import type { ComponentProps } from 'react';
import type { FieldValues } from 'react-hook-form';

type BaseSelectFieldProps = {
  placeholder?: string;
  options: SelectOptions;
  className?: string;
};

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  BaseSelectFieldProps &
  Omit<ComponentProps<'select'>, keyof BaseFieldProps<T>>;

export const MultiSelectField = <T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  options,
  placeholder,
  formItemClassName,
  className,
}: SelectFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState, formState }) => {
        return (
          <FormItem className={formItemClassName}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <MultiSelect
                options={options}
                onValueChange={(values) => {
                  field.onChange(values.length ? values : []);
                }}
                placeholder={placeholder}
                variant="default"
                maxCount={3}
                className={cn(
                  'w-full',
                  fieldState.error ? 'border-destructive' : '',
                  className
                )}
                defaultValue={
                  Array.isArray(field.value) ? (field.value as string[]) : []
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

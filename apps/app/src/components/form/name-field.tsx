import type { NameType } from '@/server/schema/common';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import { cn } from '@hexa/utils';
import type { Path, UseFormReturn } from 'react-hook-form';

export const NameField = <T extends NameType>({
  form,
  inputClassName,
  label = 'Your name',
  showLabel = true,
}: {
  form: UseFormReturn<T>;
  inputClassName?: string;
  label?: string;
  showLabel?: boolean;
}) => (
  <FormField
    control={form.control}
    name={'name' as Path<T>}
    render={({ field }) => (
      <FormItem>
        {showLabel && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input
            {...field}
            placeholder="Jane Doe"
            className={cn(
              form.formState.errors.name ? 'border-destructive' : '',
              inputClassName
            )}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

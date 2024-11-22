import type { EmailType } from '@/features/common/schema';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import type { Path, UseFormReturn } from 'react-hook-form';

export const EmailField = <T extends EmailType>({
  form,
  disabled = false,
}: {
  form: UseFormReturn<T>;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={'email' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="email@example.com"
              autoComplete="email"
              type="email"
              className={
                form.formState.errors.email ? 'border-destructive' : ''
              }
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

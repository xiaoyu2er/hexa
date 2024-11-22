import type { ConfirmType } from '@/server/schema/common';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import type { Path, UseFormReturn } from 'react-hook-form';

export const ConfirmField = <T extends ConfirmType>({
  form,
  confirmation,
}: {
  form: UseFormReturn<T>;
  confirmation: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={'confirm' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            To verify, type&nbsp;
            <span className="font-bold">{confirmation}</span>
            &nbsp;below
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              className={
                form.formState.errors.confirm ? 'border-destructive' : ''
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

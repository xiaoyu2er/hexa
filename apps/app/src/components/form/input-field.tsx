import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import type { Path, UseFormReturn } from 'react-hook-form';

type InputFieldProps = {
  [key: string]: string;
};

export const InputField = <T extends InputFieldProps>({
  form,
  name,
  label,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              className={
                form.formState.errors[name] ? 'border-destructive' : ''
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

import type { UpdateProjectSlugType } from '@/server/schema/project';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import type { Path, UseFormReturn } from 'react-hook-form';

export const SlugField = <T extends UpdateProjectSlugType>({
  form,
  disabled = false,
}: {
  form: UseFormReturn<T>;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={form.control}
      name={'slug' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <FormControl>
            <Input
              {...field}
              className={form.formState.errors.slug ? 'border-destructive' : ''}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

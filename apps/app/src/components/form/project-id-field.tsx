import type { ProjectIdType } from '@/server/schema/project';
import { FormControl, FormLabel, FormMessage } from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import type { Path, UseFormReturn } from 'react-hook-form';

export const ProjectIdField = <T extends ProjectIdType>({
  form,
}: {
  form: UseFormReturn<T>;
}) => {
  return (
    <FormField
      control={form.control}
      name={'projectId' as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project ID</FormLabel>
          <FormControl>
            <Input
              {...field}
              className={
                form.formState.errors.projectId ? 'border-destructive' : ''
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

import type { OrgNameType } from '@/server/schema/signup';
import {
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { FormField, FormItem } from '@hexa/ui/form';
import { Input } from '@hexa/ui/input';
import type { Path, UseFormReturn } from 'react-hook-form';

export const OrgNameField = <T extends OrgNameType>({
  form,
}: {
  form: UseFormReturn<T>;
}) => (
  <FormField
    control={form.control}
    name={'orgName' as Path<T>}
    render={({ field }) => (
      <FormItem>
        <FormLabel>Organization Name</FormLabel>
        <FormControl>
          <Input
            {...field}
            value={field.value ?? ''}
            placeholder="Acme Inc."
            className={
              form.formState.errors.orgName ? 'border-destructive' : ''
            }
          />
        </FormControl>
        <FormDescription>
          You can always rename your organization later
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

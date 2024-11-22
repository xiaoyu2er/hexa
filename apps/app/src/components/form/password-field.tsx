import type { PasswordType } from '@/features/common/schema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hexa/ui/form';
import { PasswordInput } from '@hexa/ui/password-input';
import type { FieldPath, Path, UseFormReturn } from 'react-hook-form';

export const PasswordField = <T extends PasswordType>({
  form,
  name = 'password' as Path<T>,
  label = 'Password',
}: {
  form: UseFormReturn<T>;
  name?: FieldPath<T>;
  label?: string;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <PasswordInput
            {...field}
            autoComplete="current-password"
            placeholder="********"
            className={form.formState.errors[name] ? 'border-destructive' : ''}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

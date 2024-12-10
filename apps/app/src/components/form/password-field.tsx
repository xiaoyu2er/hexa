import {
  InputField,
  type InputFieldProps,
} from '@/components/form/input-field';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';

export const PasswordField = <T extends FieldValues = FieldValues>({
  form,
  name,
  ...props
}: InputFieldProps<T>) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <InputField
      form={form}
      name={name}
      type="password"
      endContent={
        <button type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <Icon
              className="pointer-events-none text-2xl text-default-400"
              icon="solar:eye-closed-linear"
            />
          ) : (
            <Icon
              className="pointer-events-none text-2xl text-default-400"
              icon="solar:eye-bold"
            />
          )}
        </button>
      }
      {...props}
    />
  );
};

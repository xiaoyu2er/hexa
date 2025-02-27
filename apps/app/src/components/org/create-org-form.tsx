import { Form, FormErrorMessage } from '@/components/form';
import { InputField } from '@/components/form';
import { Button } from '@heroui/react';
import { APP_URL } from '@hexa/env';
import { getSlugByName } from '@hexa/lib';
import type { InsertOrgType } from '@hexa/server/schema/org';
import { type ComponentProps, type FormEvent, useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface CreateOrgFormProps {
  form: UseFormReturn<InsertOrgType>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  className?: string;
  buttonProps?: ComponentProps<typeof Button>;
}

export function CreateOrgForm({
  form,
  onSubmit,
  submitText = 'Create organization',
  className = '',
  buttonProps = {},
}: CreateOrgFormProps) {
  const orgName = form.watch('name');

  useEffect(() => {
    const slugState = form.getFieldState('slug');
    if (!slugState.isTouched && orgName) {
      form.setValue('slug', getSlugByName(orgName));
    }
  }, [orgName, form]);

  return (
    <Form form={form} onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      <InputField
        form={form}
        name="name"
        label="Organization Name"
        placeholder="Acme, Inc."
      />

      <div className="space-y-2">
        <InputField
          form={form}
          name="slug"
          label="Organization Slug"
          placeholder="acme"
          startContent={
            <span className="text-default-400 text-sm">{APP_URL}/</span>
          }
        />
        <p className="text-xs text-gray-500">
          This will be your organization URL.
        </p>
      </div>

      <FormErrorMessage message={form.formState?.errors?.root?.message} />

      <Button
        type="submit"
        color="primary"
        isLoading={form.formState?.isSubmitting}
        className="w-full"
        {...buttonProps}
      >
        {submitText}
      </Button>
    </Form>
  );
}

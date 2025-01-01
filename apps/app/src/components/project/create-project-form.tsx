import { Form, FormErrorMessage } from '@/components/form';
import { InputField } from '@/components/form';
import { APP_URL } from '@hexa/env';
import { getSlugByName } from '@hexa/lib';
import type { SelectOrgType } from '@hexa/server/schema/org';
import type { InsertProjectType } from '@hexa/server/schema/project';
import { Button } from '@nextui-org/react';
import { type ComponentProps, type FormEvent, useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface CreateProjectFormProps {
  form: UseFormReturn<InsertProjectType>;
  org: SelectOrgType;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText?: string;
  className?: string;
  buttonProps?: ComponentProps<typeof Button>;
}

export function CreateProjectForm({
  form,
  onSubmit,
  org,
  submitText = 'Create project',
  className = '',
  buttonProps = {},
}: CreateProjectFormProps) {
  const projectName = form.watch('name');

  useEffect(() => {
    const slugState = form.getFieldState('slug');
    if (!slugState.isTouched && projectName) {
      form.setValue('slug', getSlugByName(projectName));
    }
  }, [projectName, form]);

  return (
    <Form form={form} onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      <InputField
        form={form}
        name="name"
        label="Project Name"
        placeholder="Enter project name"
        autoComplete="off"
      />

      <div className="space-y-2">
        <InputField
          form={form}
          name="slug"
          label="Project Slug"
          placeholder="slug"
          startContent={
            <span className="text-default-400 text-sm">
              {APP_URL}/{org.slug}/
            </span>
          }
        />
        <p className="text-xs text-gray-500">This will be your project URL.</p>
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

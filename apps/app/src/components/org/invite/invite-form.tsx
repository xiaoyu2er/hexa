import { Form, FormErrorMessage } from '@/components/form';
import { InputField } from '@/components/form';
import { SelectField } from '@/components/form';
import type { CreateInvitesType } from '@hexa/server/schema/org-invite';
import { OrgRoleOptions } from '@hexa/server/schema/org-member';
import { Trash } from '@hexa/ui/icons';
import { Button } from '@nextui-org/react';
import { useEffect } from 'react';
import { type UseFormReturn, useFieldArray } from 'react-hook-form';

interface InviteFormProps {
  form: UseFormReturn<CreateInvitesType>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  maxInvites?: number;
  roleOptions?: typeof OrgRoleOptions;
  submitText?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  className?: string;
}

export function InviteForm({
  form,
  onSubmit,
  maxInvites = 10,
  roleOptions = OrgRoleOptions,
  submitText = 'Send invites',
  showSkip = false,
  onSkip,
  className = '',
}: InviteFormProps) {
  const {
    formState: { isSubmitting, errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    name: 'invites',
    control: form.control,
  });

  useEffect(() => {
    form.clearErrors('root');
  }, [fields]);

  return (
    <Form form={form} onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {fields.map((field, index) => (
        <div className="flex w-full items-start space-x-2" key={field.id}>
          <InputField
            form={form}
            name={`invites.${index}.email`}
            size="md"
            placeholder="Email"
            hideErrorMessageCodes={['invalid_string']}
          />
          <SelectField
            form={form}
            size="md"
            name={`invites.${index}.role`}
            options={roleOptions}
          />
          <Button
            type="button"
            variant="light"
            isIconOnly
            aria-label="Remove invite"
            className="mt-2 h-6 w-6 min-w-6"
            onPress={() => remove(index)}
          >
            <Trash className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      ))}
      {fields.length < maxInvites && (
        <Button
          type="button"
          variant="bordered"
          size="sm"
          className="w-fit"
          onPress={() => append({ email: '', role: 'MEMBER' })}
        >
          Add Invite
        </Button>
      )}

      <FormErrorMessage message={errors.root?.message} />

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={isSubmitting}
        >
          {submitText}
        </Button>
        {showSkip && (
          <Button type="button" variant="light" onPress={onSkip}>
            I'll do this later
          </Button>
        )}
      </div>
    </Form>
  );
}

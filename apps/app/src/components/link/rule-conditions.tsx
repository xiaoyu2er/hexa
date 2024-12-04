'use client';

import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import {
  RULE_FIELDS,
  RULE_OPERATORS,
  type RulesFormType,
} from '@/server/schema/link';
import { Button } from '@hexa/ui/button';
import { TrashIcon } from '@hexa/ui/icons';
import { useFieldArray, type useForm } from 'react-hook-form';

export const RuleConditions = ({
  ruleIndex,
  form,
}: {
  ruleIndex: number;
  form: ReturnType<typeof useForm<RulesFormType>>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `rules.${ruleIndex}.conditions`,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h5 className="font-medium text-sm">Conditions</h5>
          <p className="text-muted-foreground text-xs">
            When all conditions below are met, the link will redirect to the
            destination URL
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ field: '', operator: 'EQ', value: '' })}
        >
          Add Condition
        </Button>
      </div>

      <div className="rounded-lg border p-3">
        {fields.map((condition, condIndex) => (
          <div key={condition.id}>
            <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2">
              <SelectField
                form={form}
                name={`rules.${ruleIndex}.conditions.${condIndex}.field`}
                options={RULE_FIELDS}
                placeholder="Select field"
              />
              <SelectField
                form={form}
                name={`rules.${ruleIndex}.conditions.${condIndex}.operator`}
                options={RULE_OPERATORS}
                placeholder="Select operator"
              />
              <InputField
                form={form}
                name={`rules.${ruleIndex}.conditions.${condIndex}.value`}
                placeholder="Enter value"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(condIndex)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>

            {condIndex < fields.length - 1 && (
              <div className="my-2 flex items-center gap-2 px-2">
                <div className="h-px flex-grow bg-border" />
                <span className="font-medium text-muted-foreground text-xs">
                  AND
                </span>
                <div className="h-px flex-grow bg-border" />
              </div>
            )}
          </div>
        ))}

        {fields.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No conditions added yet
          </p>
        )}
      </div>
    </div>
  );
};

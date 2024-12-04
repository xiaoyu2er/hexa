'use client';

import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import {
  RULE_FIELDS,
  type RuleField,
  type RuleOperator,
  type RulesFormType,
  getFieldOperatorLabels,
  getValueInputType,
  getValueOptions,
} from '@/server/schema/link';
import { Button } from '@hexa/ui/button';
import { TrashIcon } from '@hexa/ui/icons';
import { MultiSelect } from '@hexa/ui/multi-select';
import { type Path, useFieldArray, type useForm } from 'react-hook-form';

export const RuleConditions = ({
  ruleIndex,
  form,
}: {
  ruleIndex: number;
  form: ReturnType<typeof useForm<RulesFormType>>;
}) => {
  const { watch } = form;
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
        {fields.map((condition, condIndex) => {
          const conditionFieldName =
            `rules.${ruleIndex}.conditions.${condIndex}.field` as Path<RulesFormType>;
          const fieldValue = watch(conditionFieldName);
          const conditionFieldOperatorLabels = getFieldOperatorLabels(
            fieldValue as RuleField | undefined
          );
          const conditionOperatorName =
            `rules.${ruleIndex}.conditions.${condIndex}.operator` as Path<RulesFormType>;
          const operatorValue = watch(conditionOperatorName);

          const valueInputType = getValueInputType(
            fieldValue as RuleField | undefined,
            operatorValue as RuleOperator | undefined
          );

          const valueOptions = getValueOptions(
            fieldValue as RuleField | undefined,
            operatorValue as RuleOperator | undefined
          );

          const input = (
            <InputField
              form={form}
              name={`rules.${ruleIndex}.conditions.${condIndex}.value`}
              placeholder="Enter value"
            />
          );

          const multiSelect = (
            <MultiSelect
              options={valueOptions}
              onValueChange={(values) => {
                form.setValue(
                  `rules.${ruleIndex}.conditions.${condIndex}.value`,
                  values.length ? values : []
                );
              }}
              placeholder="Select options..."
              variant="default"
              maxCount={3}
              className="w-full"
            />
          );
          const select = (
            <SelectField
              form={form}
              name={`rules.${ruleIndex}.conditions.${condIndex}.value`}
              options={valueOptions}
              placeholder="Select value"
            />
          );

          const valueInput =
            valueInputType === 'text'
              ? input
              : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                valueInputType === 'multi-select'
                ? multiSelect
                : select;
          return (
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
                  name={conditionOperatorName}
                  options={conditionFieldOperatorLabels}
                  placeholder="Select operator"
                />
                {valueInput}
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
          );
        })}

        {fields.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No conditions added yet
          </p>
        )}
      </div>
    </div>
  );
};

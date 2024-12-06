'use client';

import { InputField } from '@/components/form/input-field';
import { MultiSelectField } from '@/components/form/multi-select-field';
import { SelectField } from '@/components/form/select-field';
import { TimeField } from '@/components/form/time-field';
import {
  RULE_FIELD_SELECT_OPTIONS,
  type RuleField,
  type RuleOperator,
  type RulesFormType,
  getOperatorSelectOptions,
  getValueInputType,
  getValueOptions,
} from '@hexa/const/rule';
import { Button } from '@hexa/ui/button';
import { TrashIcon } from '@hexa/ui/icons';
import { type Path, useFieldArray, type useForm } from 'react-hook-form';

export const RuleConditions = ({
  ruleIndex,
  form,
}: {
  ruleIndex: number;
  form: ReturnType<typeof useForm<RulesFormType>>;
}) => {
  const { watch } = form;
  const {
    fields: conditions,
    append,
    remove,
  } = useFieldArray({
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
          onClick={() =>
            append({
              field: undefined as unknown as RuleField,
              operator: undefined as unknown as RuleOperator,
              value: undefined as unknown as string,
            })
          }
        >
          Add Condition
        </Button>
      </div>

      <div className="rounded-lg border p-3">
        {conditions.map((condition, condIndex) => {
          const filedKey =
            `rules.${ruleIndex}.conditions.${condIndex}.field` as Path<RulesFormType>;
          const fieldValue = watch(filedKey);

          const operatorSelectOptions = getOperatorSelectOptions(
            fieldValue as RuleField | undefined
          );
          const operatorKey =
            `rules.${ruleIndex}.conditions.${condIndex}.operator` as Path<RulesFormType>;
          const operatorValue = watch(operatorKey);

          const valueInputType = getValueInputType(
            fieldValue as RuleField | undefined,
            operatorValue as RuleOperator | undefined
          );

          const valueOptions = getValueOptions(
            fieldValue as RuleField | undefined,
            operatorValue as RuleOperator | undefined,
            conditions
          );

          const _value = watch(
            `rules.${ruleIndex}.conditions.${condIndex}.value`
          );

          const valueName =
            `rules.${ruleIndex}.conditions.${condIndex}.value` as Path<RulesFormType>;
          let valueInput = (
            <InputField
              form={form}
              name={valueName}
              placeholder="Enter value"
            />
          );
          if (valueInputType === 'time') {
            valueInput = <TimeField form={form} name={valueName} />;
          } else if (valueInputType === 'multi-select') {
            valueInput = (
              <MultiSelectField
                form={form}
                name={valueName}
                options={valueOptions}
                placeholder="Select options..."
              />
            );
          } else if (valueInputType === 'select') {
            valueInput = (
              <SelectField
                form={form}
                name={valueName}
                options={valueOptions}
                placeholder="Select value"
              />
            );
          }
          return (
            <div key={condition.id}>
              <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2">
                <SelectField
                  form={form}
                  name={`rules.${ruleIndex}.conditions.${condIndex}.field`}
                  options={RULE_FIELD_SELECT_OPTIONS}
                  placeholder="Select field"
                />
                <SelectField
                  form={form}
                  name={operatorKey}
                  options={operatorSelectOptions}
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

              {condIndex < conditions.length - 1 && (
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

        {conditions.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No conditions added yet
          </p>
        )}
      </div>
    </div>
  );
};

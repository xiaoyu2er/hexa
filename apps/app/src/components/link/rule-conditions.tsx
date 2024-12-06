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
import { PlusIcon, TrashIcon } from '@hexa/ui/icons';
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
      <div className="space-y-1">
        <h5 className="font-medium text-sm">Conditions</h5>
        <p className="text-muted-foreground text-xs">
          When all conditions below are met, the link will redirect to the
          destination URL
        </p>
      </div>

      <div className="space-y-3 rounded-lg border p-3">
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
              <div className="space-y-2 sm:grid sm:grid-cols-[180px,180px,1fr,auto] sm:gap-2 sm:space-y-0">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SelectField
                      form={form}
                      name={`rules.${ruleIndex}.conditions.${condIndex}.field`}
                      options={RULE_FIELD_SELECT_OPTIONS}
                      placeholder="Select field"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(condIndex)}
                    className="h-10 w-10 shrink-0 sm:hidden"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>

                <SelectField
                  form={form}
                  name={operatorKey}
                  options={operatorSelectOptions}
                  placeholder="Select operator"
                />
                <div className="min-w-0">{valueInput}</div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(condIndex)}
                  className="hidden h-10 w-10 shrink-0 sm:flex"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>

              {condIndex < conditions.length - 1 && (
                <div className="my-3 flex items-center gap-2 px-2 sm:my-2">
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

        {conditions.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            No conditions added yet
          </p>
        ) : null}

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
          className="w-full"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      </div>
    </div>
  );
};

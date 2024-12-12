'use client';
import { SelectField } from '@/components/form/select-field';
import {
  RuleValueInput,
  RuleValueInputPlaceholder,
} from '@/components/link/rule-value-input';
import {
  FIELD_CONFIGS,
  type LinkRuleCondition,
  RULE_OPERATORS,
  type RuleField,
  type RuleOperator,
  type RulesFormType,
  getRuleFieldSelectOptions,
} from '@hexa/const/rule';
import { TrashIcon } from '@hexa/ui/icons';
import { Button } from '@nextui-org/react';
import type { Path, useForm } from 'react-hook-form';

export const RuleCondition = ({
  formKey,
  form,
  conditions,
  onRemove,
  onUpdate,
}: {
  conditions: LinkRuleCondition[];

  formKey: string;
  form: ReturnType<typeof useForm<RulesFormType>>;
  onRemove: () => void;
  onUpdate: (value: LinkRuleCondition) => void;
}) => {
  const filedKey = `${formKey}.field` as Path<RulesFormType>;
  const operatorKey = `${formKey}.operator` as Path<RulesFormType>;
  const valueKey = `${formKey}.value` as Path<RulesFormType>;
  const fieldValue = form.watch(filedKey) as RuleField;
  const operatorValue = form.watch(operatorKey) as RuleOperator;
  const fieldOptions = getRuleFieldSelectOptions(conditions, fieldValue);
  const fieldConfig = FIELD_CONFIGS[fieldValue as RuleField] ?? {
    operators: [],
    valueType: () => ({ type: 'INPUT' }),
  };

  const operatorOptions = fieldConfig.operators.map(({ operator }) => {
    return {
      label: RULE_OPERATORS[operator],
      value: operator,
    };
  });

  const { type: valueInputType, props: valueInputProps } =
    fieldConfig.valueType(operatorValue as RuleOperator, conditions);

  return (
    <div className="flex w-full flex-col gap-2 sm:grid sm:grid-cols-[180px,180px,1fr,auto] sm:items-start">
      <div className="flex items-center gap-2">
        <SelectField
          form={form}
          name={filedKey}
          options={fieldOptions}
          placeholder="Select field"
          hideErrorMessageCodes={['invalid_union_discriminator']}
          className="min-w-[120px] flex-1"
          maxListboxHeight={308}
          onChange={(fieldValue) => {
            onUpdate({
              field: fieldValue as RuleField,
              operator: '',
              value: '',
            } as unknown as LinkRuleCondition);
          }}
        />

        <Button
          type="button"
          variant="light"
          isIconOnly
          size="sm"
          aria-label="Remove condition"
          onClick={() => onRemove()}
          className="shrink-0 p-0 sm:hidden"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>

      <SelectField
        form={form}
        name={operatorKey}
        maxListboxHeight={308}
        options={operatorOptions}
        placeholder="Select operator"
        hideErrorMessageCodes={['invalid_enum_value']}
        className="min-w-[120px]"
        onChange={(operatorValue) => {
          const operatorConfig = fieldConfig.operators.find(
            ({ operator }) => operator === operatorValue
          );

          if (!operatorConfig) {
            return;
          }
          onUpdate({
            field: fieldValue as RuleField,
            operator: operatorValue as RuleOperator,
            value: operatorConfig?.defaultValue as LinkRuleCondition['value'],
          } as unknown as LinkRuleCondition);
        }}
      />

      <div className="w-full">
        {operatorValue ? (
          <RuleValueInput
            inputType={valueInputType}
            inputProps={valueInputProps}
            inputValue={fieldValue}
            inputName={valueKey}
            form={form}
          />
        ) : (
          <RuleValueInputPlaceholder />
        )}
      </div>

      <Button
        type="button"
        variant="light"
        isIconOnly
        size="sm"
        aria-label="Remove condition"
        onClick={() => onRemove()}
        className="hidden h-10 w-10 shrink-0 p-0 sm:flex"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

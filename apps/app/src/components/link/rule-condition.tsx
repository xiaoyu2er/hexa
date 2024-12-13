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
import { cn } from '@hexa/utils';
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
  const subFieldKey = `${formKey}.subField` as Path<RulesFormType>;
  const operatorKey = `${formKey}.operator` as Path<RulesFormType>;
  const valueKey = `${formKey}.value` as Path<RulesFormType>;
  const fieldValue = form.watch(filedKey) as RuleField;
  const subFieldValue = form.watch(subFieldKey) as RuleField;
  const operatorValue = form.watch(operatorKey) as RuleOperator;
  const fieldOptions = getRuleFieldSelectOptions(conditions, fieldValue);
  const fieldConfig = FIELD_CONFIGS[fieldValue as RuleField] ?? {
    subField: null,
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

  const subFieldInput = fieldConfig.subField ? (
    <RuleValueInput
      inputType={fieldConfig.subField.type}
      inputProps={fieldConfig.subField.props}
      inputValue={subFieldValue}
      inputName={subFieldKey}
      form={form}
    />
  ) : null;

  const valueInput = operatorValue ? (
    <div className="relative overflow-x-auto">
      <RuleValueInput
        inputType={valueInputType}
        inputProps={valueInputProps}
        inputValue={fieldValue}
        inputName={valueKey}
        form={form}
      />
    </div>
  ) : (
    <RuleValueInputPlaceholder />
  );

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 sm:grid sm:items-start',
        // Adjust grid columns based on whether subField exists
        fieldConfig.subField
          ? 'sm:grid-cols-[180px,180px,180px,1fr,40px]'
          : 'sm:grid-cols-[180px,180px,1fr,40px]'
      )}
    >
      <div className="flex items-center gap-2">
        <SelectField
          form={form}
          name={filedKey}
          options={fieldOptions}
          placeholder="Select field"
          className="min-w-[180px]"
          hideErrorMessageCodes={['invalid_union_discriminator']}
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

      {fieldConfig.subField && (
        <div className="min-w-[180px]">{subFieldInput}</div>
      )}

      <SelectField
        form={form}
        name={operatorKey}
        maxListboxHeight={308}
        options={operatorOptions}
        placeholder="Select operator"
        hideErrorMessageCodes={['invalid_enum_value']}
        className="min-w-[180px]"
        onChange={(operatorValue) => {
          const operatorConfig = fieldConfig.operators.find(
            ({ operator }) => operator === operatorValue
          );

          if (!operatorConfig) {
            return;
          }
          onUpdate({
            field: fieldValue as RuleField,
            subField: subFieldValue,
            operator: operatorValue as RuleOperator,
            value: operatorConfig?.defaultValue as LinkRuleCondition['value'],
          } as unknown as LinkRuleCondition);
        }}
      />

      <div className="w-full">{valueInput}</div>

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

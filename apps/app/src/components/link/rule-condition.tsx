'use client';
import { SelectField } from '@/components/form';
import {
  RuleValueInput,
  RuleValueInputPlaceholder,
} from '@/components/link/rule-value-input';
import { RuleValueTips } from '@/components/link/rule-value-tips';
import { Button } from '@heroui/react';
import {
  FIELD_CONFIGS,
  type LinkRuleCondition,
  RULE_OPERATORS,
  type RuleField,
  type RuleOperator,
  type RulesFormType,
  getRuleFieldSelectOptions,
} from '@hexa/const/rule';
import { cn } from '@hexa/lib';
import { TrashIcon } from '@hexa/ui/icons';
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
      hideErrorMessageCodes={[
        'too_small',
        'invalid_type',
        'invalid_enum_value',
        'invalid_union_discriminator',
      ]}
    />
  ) : null;

  const valueInput = operatorValue ? (
    /* 
      The min-w-0 is crucial here to allow proper text truncation in grid/flex layouts.
      By default, grid/flex items have min-width: auto, which prevents shrinking below content size.
      Setting min-w-0 allows the container to shrink below its content width,
      enabling text-overflow: ellipsis to work properly.
    */
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex-1">
        <RuleValueInput
          inputType={valueInputType}
          inputProps={valueInputProps}
          inputValue={fieldValue}
          inputName={valueKey}
          form={form}
        />
      </div>
      <RuleValueTips fieldType={fieldValue} />
    </div>
  ) : (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex-1">
        <RuleValueInputPlaceholder />
      </div>
      <RuleValueTips fieldType={fieldValue} />
    </div>
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
              field: fieldValue,
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
          onPress={() => onRemove()}
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

      {valueInput}
      <Button
        type="button"
        variant="light"
        isIconOnly
        size="sm"
        aria-label="Remove condition"
        onPress={() => onRemove()}
        className="hidden h-10 w-10 shrink-0 p-0 sm:flex"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

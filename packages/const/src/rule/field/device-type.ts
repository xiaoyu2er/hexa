import { z } from 'zod';
import { DeviceTypeSelectOptions, zDeviceTypeCode } from '../../device-type';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_DEVICE_TYPE_FIELD =
  'DEVICE_TYPE' as const satisfies RuleField;
export const LINK_RULE_DEVICE_TYPE_OPERATORS = [
  'EQ',
  'NEQ',
  'IN',
  'NOT_IN',
] as const satisfies RuleOperator[];

export const LINK_RULE_DEVICE_TYPE_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
    { operator: 'IN', defaultValue: [] },
    { operator: 'NOT_IN', defaultValue: [] },
  ],
  valueType: (operator) =>
    operator === 'EQ' || operator === 'NEQ'
      ? { type: 'SELECT', props: { options: DeviceTypeSelectOptions } }
      : { type: 'MULTI_SELECT', props: { options: DeviceTypeSelectOptions } },
};

export const zLinkRuleDeviceTypeOperator = z.enum(
  LINK_RULE_DEVICE_TYPE_OPERATORS
);
export type LinkRuleDeviceTypeOperator = z.infer<
  typeof zLinkRuleDeviceTypeOperator
>;

export const LinkRuleDeviceTypeConditionSchema = z.object({
  field: z.literal(LINK_RULE_DEVICE_TYPE_FIELD),
  operator: zLinkRuleDeviceTypeOperator,
  value: z.union([zDeviceTypeCode, z.array(zDeviceTypeCode)]),
});

export type LinkRuleDeviceTypeCondition = z.infer<
  typeof LinkRuleDeviceTypeConditionSchema
>;

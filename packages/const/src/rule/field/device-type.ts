import { z } from 'zod';
import { zDeviceTypeCode } from '../../device-type';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_DEVICE_TYPE_FIELD =
  'DEVICE_TYPE' as const satisfies RuleField;
export const LINK_RULE_DEVICE_TYPE_OPERATORS = [
  'EQ',
  'NEQ',
  'IN',
  'NOT_IN',
] as const satisfies RuleOperator[];
export const zLinkRuleDeviceTypeOperator = z.enum(
  LINK_RULE_DEVICE_TYPE_OPERATORS
);
export type LinkRuleDeviceTypeOperator = z.infer<
  typeof zLinkRuleDeviceTypeOperator
>;

export const LinkRuleDeviceTypeConditionSchema = z.object({
  field: z.literal(LINK_RULE_DEVICE_TYPE_FIELD),
  operator: zLinkRuleDeviceTypeOperator,
  value: zDeviceTypeCode,
});

export type LinkRuleDeviceTypeCondition = z.infer<
  typeof LinkRuleDeviceTypeConditionSchema
>;

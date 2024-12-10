import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator, RuleOperatorConfigs } from '../operator';

export const LINK_RULE_POSTAL_CODE_FIELD =
  'POSTAL_CODE' as const satisfies RuleField;

export const LINK_RULE_POSTAL_CODE_OPERATORS = [
  'EQ',
  'NEQ',
  'IN',
  'NOT_IN',
  'CONTAINS',
  'NOT_CONTAINS',
] as const satisfies RuleOperator[];

export const LINK_RULE_POSTAL_CODE_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  { operator: 'EQ', defaultValue: '' },
  { operator: 'NEQ', defaultValue: '' },
  { operator: 'IN', defaultValue: [] },
  { operator: 'NOT_IN', defaultValue: [] },
  { operator: 'CONTAINS', defaultValue: '' },
  { operator: 'NOT_CONTAINS', defaultValue: '' },
];

export const zLinkRulePostalCodeOperator = z.enum(
  LINK_RULE_POSTAL_CODE_OPERATORS
);
export type LinkRulePostalCodeOperator = z.infer<
  typeof zLinkRulePostalCodeOperator
>;

export const LinkRulePostalCodeConditionSchema = z.object({
  field: z.literal(LINK_RULE_POSTAL_CODE_FIELD),
  operator: zLinkRulePostalCodeOperator,
  value: z.string(),
});

export type LinkRulePostalCodeCondition = z.infer<
  typeof LinkRulePostalCodeConditionSchema
>;

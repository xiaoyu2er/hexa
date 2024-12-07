import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

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

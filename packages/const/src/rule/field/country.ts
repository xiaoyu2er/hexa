import { z } from 'zod';
import { zCountryCode } from '../../country';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_COUNTRY_FIELD = 'COUNTRY' as const satisfies RuleField;

export const LINK_RULE_COUNTRY_OPERATORS = [
  'IN',
  'NOT_IN',
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];

export const zLinkRuleCountryOperator = z.enum(LINK_RULE_COUNTRY_OPERATORS);
export type LinkRuleCountryOperator = z.infer<typeof zLinkRuleCountryOperator>;

export const LinkRuleCountryConditionSchema = z.object({
  field: z.literal(LINK_RULE_COUNTRY_FIELD),
  operator: zLinkRuleCountryOperator,
  value: z.union([zCountryCode, z.array(zCountryCode)]),
});

export type LinkRuleCountryCondition = z.infer<
  typeof LinkRuleCountryConditionSchema
>;

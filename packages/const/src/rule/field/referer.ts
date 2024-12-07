import { z } from 'zod';
import { zRegex } from '../../regex';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_REFERER_FIELD = 'REFERER' as const satisfies RuleField;
export const LINK_RULE_REFERER_OPERATORS = [
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
] as const satisfies RuleOperator[];
export const zLinkRuleRefererOperator = z.enum(LINK_RULE_REFERER_OPERATORS);
export type LinkRuleRefererOperator = z.infer<typeof zLinkRuleRefererOperator>;

export const LinkRuleRefererConditionSchema = z.object({
  field: z.literal(LINK_RULE_REFERER_FIELD),
  operator: zLinkRuleRefererOperator,
  value: z.union([z.string(), zRegex]),
});

export type LinkRuleRefererCondition = z.infer<
  typeof LinkRuleRefererConditionSchema
>;

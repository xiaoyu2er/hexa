import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_TIME_FIELD = 'TIME' as const satisfies RuleField;
export const LINK_RULE_TIME_OPERATORS = [
  'LT',
  'LE',
  'GT',
  'GE',
] as const satisfies RuleOperator[];

export const zLinkRuleTimeOperator = z.enum(LINK_RULE_TIME_OPERATORS);
export type LinkRuleTimeOperator = z.infer<typeof zLinkRuleTimeOperator>;

export const LinkRuleTimeConditionSchema = z.object({
  field: z.literal(LINK_RULE_TIME_FIELD),
  operator: zLinkRuleTimeOperator,
  value: z.string().datetime({ offset: true }),
});

export type LinkRuleTimeCondition = z.infer<typeof LinkRuleTimeConditionSchema>;

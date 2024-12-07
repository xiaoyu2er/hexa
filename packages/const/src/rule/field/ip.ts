import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_IP_FIELD = 'IP' as const satisfies RuleField;
export const LINK_RULE_IP_OPERATORS = [
  'EQ',
  'NEQ',
  'REG',
  'NREG',
  'IN',
  'NOT_IN',
] as const satisfies RuleOperator[];
export const zLinkRuleIpOperator = z.enum(LINK_RULE_IP_OPERATORS);
export type LinkRuleIpOperator = z.infer<typeof zLinkRuleIpOperator>;

export const LinkRuleIpConditionSchema = z.object({
  field: z.literal(LINK_RULE_IP_FIELD),
  operator: zLinkRuleIpOperator,
  value: z.string().ip(),
});

export type LinkRuleIpCondition = z.infer<typeof LinkRuleIpConditionSchema>;

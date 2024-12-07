import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_USER_AGENT_FIELD =
  'USER_AGENT' as const satisfies RuleField;
export const LINK_RULE_USER_AGENT_OPERATORS = [
  'EQ',
  'NEQ',
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
] as const satisfies RuleOperator[];
export const zLinkRuleUserAgentOperator = z.enum(
  LINK_RULE_USER_AGENT_OPERATORS
);
export type LinkRuleUserAgentOperator = z.infer<
  typeof zLinkRuleUserAgentOperator
>;

export const LinkRuleUserAgentConditionSchema = z.object({
  field: z.literal(LINK_RULE_USER_AGENT_FIELD),
  operator: zLinkRuleUserAgentOperator,
  value: z.string(),
});

export type LinkRuleUserAgentCondition = z.infer<
  typeof LinkRuleUserAgentConditionSchema
>;

import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator, RuleOperatorConfigs } from '../operator';

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

export const LINK_RULE_USER_AGENT_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  { operator: 'EQ', defaultValue: '' },
  { operator: 'NEQ', defaultValue: '' },
  { operator: 'CONTAINS', defaultValue: '' },
  { operator: 'NOT_CONTAINS', defaultValue: '' },
  { operator: 'REG', defaultValue: [] },
  { operator: 'NREG', defaultValue: [] },
];

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

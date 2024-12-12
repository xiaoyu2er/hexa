import { z } from 'zod';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_USER_AGENT_FIELD =
  'USER_AGENT' as const satisfies RuleField;
export const LINK_RULE_USER_AGENT_OPERATORS = [
  'EQ',
  'NEQ',
  'CONTAINS',
  'NOT_CONTAINS',
  'IN',
  'NOT_IN',
  'REG',
  'NREG',
] as const satisfies RuleOperator[];

export const LINK_RULE_USER_AGENT_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
    { operator: 'CONTAINS', defaultValue: '' },
    { operator: 'NOT_CONTAINS', defaultValue: '' },
    { operator: 'IN', defaultValue: [''] },
    { operator: 'NOT_IN', defaultValue: [''] },
    { operator: 'REG', defaultValue: [] },
    { operator: 'NREG', defaultValue: [] },
  ],
  valueType: (operator) => {
    if (operator === 'REG' || operator === 'NREG') {
      return { type: 'REGEX' };
    }
    if (operator === 'IN' || operator === 'NOT_IN') {
      return { type: 'MULTI_INPUT' };
    }
    return { type: 'INPUT' };
  },
};

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

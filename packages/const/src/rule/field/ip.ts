import { z } from 'zod';
import type { FieldConfig, RuleField } from '../field';
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

export const LINK_RULE_IP_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
    { operator: 'REG', defaultValue: [] },
    { operator: 'NREG', defaultValue: [] },
    { operator: 'IN', defaultValue: [''] },
    { operator: 'NOT_IN', defaultValue: [''] },
  ],
  valueType: (operator) => {
    if (operator === 'IN' || operator === 'NOT_IN') {
      return { type: 'MULTI_INPUT' };
    }
    if (operator === 'REG' || operator === 'NREG') {
      return { type: 'REGEX' };
    }
    return { type: 'INPUT' };
  },
};

export const zLinkRuleIpOperator = z.enum(LINK_RULE_IP_OPERATORS);
export type LinkRuleIpOperator = z.infer<typeof zLinkRuleIpOperator>;

export const LinkRuleIpConditionSchema = z.object({
  field: z.literal(LINK_RULE_IP_FIELD),
  operator: zLinkRuleIpOperator,
  value: z.union([z.string().ip(), z.array(z.string().ip())]),
});

export type LinkRuleIpCondition = z.infer<typeof LinkRuleIpConditionSchema>;

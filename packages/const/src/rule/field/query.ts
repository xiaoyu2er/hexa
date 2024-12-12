import { z } from 'zod';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_QUERY_FIELD = 'QUERY' as const satisfies RuleField;
export const LINK_RULE_QUERY_OPERATORS = [
  'EQ',
  'NEQ',
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
] as const satisfies RuleOperator[];

export const LINK_RULE_QUERY_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
    { operator: 'CONTAINS', defaultValue: '' },
    { operator: 'NOT_CONTAINS', defaultValue: '' },
    { operator: 'REG', defaultValue: [] },
    { operator: 'NREG', defaultValue: [] },
  ],
  valueType: (operator) => {
    if (operator === 'REG' || operator === 'NREG') {
      return { type: 'REGEX' };
    }
    return { type: 'INPUT' };
  },
};

export const zLinkRuleQueryOperator = z.enum(LINK_RULE_QUERY_OPERATORS);
export type LinkRuleQueryOperator = z.infer<typeof zLinkRuleQueryOperator>;

export const LinkRuleQueryConditionSchema = z.object({
  field: z.literal(LINK_RULE_QUERY_FIELD),
  operator: zLinkRuleQueryOperator,
  value: z.string(),
});

export type LinkRuleQueryCondition = z.infer<
  typeof LinkRuleQueryConditionSchema
>;

import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator, RuleOperatorConfigs } from '../operator';

export const LINK_RULE_QUERY_FIELD = 'QUERY' as const satisfies RuleField;
export const LINK_RULE_QUERY_OPERATORS = [
  'EQ',
  'NEQ',
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
] as const satisfies RuleOperator[];

export const LINK_RULE_QUERY_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  { operator: 'EQ', defaultValue: '' },
  { operator: 'NEQ', defaultValue: '' },
  { operator: 'CONTAINS', defaultValue: '' },
  { operator: 'NOT_CONTAINS', defaultValue: '' },
  { operator: 'REG', defaultValue: [] },
  { operator: 'NREG', defaultValue: [] },
];

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

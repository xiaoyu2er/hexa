import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator, RuleOperatorConfigs } from '../operator';

export const LINK_RULE_TIME_FIELD = 'TIME' as const satisfies RuleField;
export const LINK_RULE_TIME_OPERATORS = [
  'LT',
  'LE',
  'GT',
  'GE',
  'BETWEEN',
  'NOT_BETWEEN',
] as const satisfies RuleOperator[];

export const LINK_RULE_TIME_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  { operator: 'LT', defaultValue: '' },
  { operator: 'LE', defaultValue: '' },
  { operator: 'GT', defaultValue: '' },
  { operator: 'GE', defaultValue: '' },
  { operator: 'BETWEEN', defaultValue: [] },
  { operator: 'NOT_BETWEEN', defaultValue: [] },
];

export const zLinkRuleTimeOperator = z.enum(LINK_RULE_TIME_OPERATORS);
export type LinkRuleTimeOperator = z.infer<typeof zLinkRuleTimeOperator>;

export const LinkRuleTimeConditionSchema = z.object({
  field: z.literal(LINK_RULE_TIME_FIELD),
  operator: zLinkRuleTimeOperator,
  value: z.union([
    z.string().datetime({ offset: true }),
    z.tuple([
      z.string().datetime({ offset: true }),
      z.string().datetime({ offset: true }),
    ]),
  ]),
});

export type LinkRuleTimeCondition = z.infer<typeof LinkRuleTimeConditionSchema>;

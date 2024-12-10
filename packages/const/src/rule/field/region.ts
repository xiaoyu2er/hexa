import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator, RuleOperatorConfigs } from '../operator';

export const LINK_RULE_REGION_CODE_FIELD =
  'REGION_CODE' as const satisfies RuleField;

export const LINK_RULE_REGION_CODE_OPERATORS = [
  'IN',
  'NOT_IN',
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];

export const LINK_RULE_REGION_CODE_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  { operator: 'IN', defaultValue: [] },
  { operator: 'NOT_IN', defaultValue: [] },
  { operator: 'EQ', defaultValue: '' },
  { operator: 'NEQ', defaultValue: '' },
];

export const zLinkRuleRegionCodeOperator = z.enum(
  LINK_RULE_REGION_CODE_OPERATORS
);
export type LinkRuleRegionCodeOperator = z.infer<
  typeof zLinkRuleRegionCodeOperator
>;

export const LinkRuleRegionCodeConditionSchema = z.object({
  field: z.literal(LINK_RULE_REGION_CODE_FIELD),
  operator: zLinkRuleRegionCodeOperator,
  value: z.union([z.string(), z.array(z.string())]),
});

export type LinkRuleRegionCodeCondition = z.infer<
  typeof LinkRuleRegionCodeConditionSchema
>;

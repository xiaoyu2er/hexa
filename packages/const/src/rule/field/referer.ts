import { z } from 'zod';
import { zRegex } from '../../regex';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_REFERER_FIELD = 'REFERER' as const satisfies RuleField;
export const LINK_RULE_REFERER_OPERATORS = [
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
  'IN',
  'NOT_IN',
] as const satisfies RuleOperator[];

export const LINK_RULE_REFERER_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'CONTAINS', defaultValue: '' },
    { operator: 'NOT_CONTAINS', defaultValue: '' },
    { operator: 'REG', defaultValue: [] },
    { operator: 'NREG', defaultValue: [] },
    { operator: 'IN', defaultValue: [''] },
    { operator: 'NOT_IN', defaultValue: [''] },
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

export const zLinkRuleRefererOperator = z.enum(LINK_RULE_REFERER_OPERATORS);
export type LinkRuleRefererOperator = z.infer<typeof zLinkRuleRefererOperator>;

export const LinkRuleRefererConditionSchema = z.object({
  field: z.literal(LINK_RULE_REFERER_FIELD),
  operator: zLinkRuleRefererOperator,
  value: z.union([z.string(), zRegex]),
});

export type LinkRuleRefererCondition = z.infer<
  typeof LinkRuleRefererConditionSchema
>;

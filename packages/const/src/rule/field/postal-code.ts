import { z } from 'zod';
import { defaultRegex, zRegex } from '../../regex';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_POSTAL_CODE_FIELD =
  'POSTAL_CODE' as const satisfies RuleField;

export const LINK_RULE_POSTAL_CODE_OPERATORS = [
  'EQ',
  'NEQ',
  'IN',
  'NOT_IN',
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
] as const satisfies RuleOperator[];

export const LINK_RULE_POSTAL_CODE_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
    { operator: 'CONTAINS', defaultValue: '' },
    { operator: 'NOT_CONTAINS', defaultValue: '' },
    { operator: 'REG', defaultValue: defaultRegex },
    { operator: 'NREG', defaultValue: defaultRegex },
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

export const zLinkRulePostalCodeOperator = z.enum(
  LINK_RULE_POSTAL_CODE_OPERATORS
);
export type LinkRulePostalCodeOperator = z.infer<
  typeof zLinkRulePostalCodeOperator
>;

export const LinkRulePostalCodeConditionSchema = z.object({
  field: z.literal(LINK_RULE_POSTAL_CODE_FIELD),
  operator: zLinkRulePostalCodeOperator,
  value: z.union([
    z.string().min(1),
    z.array(z.string().min(1)).min(1),
    zRegex,
  ]),
});

export type LinkRulePostalCodeCondition = z.infer<
  typeof LinkRulePostalCodeConditionSchema
>;

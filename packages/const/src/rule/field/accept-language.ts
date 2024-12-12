import { z } from 'zod';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_ACCEPT_LANGUAGE_FIELD =
  'ACCEPT_LANGUAGE' as const satisfies RuleField;
export const LINK_RULE_ACCEPT_LANGUAGE_OPERATORS = [
  'EQ',
  'NEQ',
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
  'IN',
  'NOT_IN',
] as const satisfies RuleOperator[];

export const LINK_RULE_ACCEPT_LANGUAGE_FIELD_CONFIG = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
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
} as const satisfies FieldConfig;

export const zLinkRuleAcceptLanguageOperator = z.enum(
  LINK_RULE_ACCEPT_LANGUAGE_OPERATORS
);
export type LinkRuleAcceptLanguageOperator = z.infer<
  typeof zLinkRuleAcceptLanguageOperator
>;

export const zAcceptLanguageValue = z.string().min(1);
export const zAcceptLanguageValues = z.array(zAcceptLanguageValue).min(1);

export const LinkRuleAcceptLanguageConditionSchema = z.object({
  field: z.literal(LINK_RULE_ACCEPT_LANGUAGE_FIELD),
  operator: zLinkRuleAcceptLanguageOperator,
  value: z.union([zAcceptLanguageValue, zAcceptLanguageValues]),
});
// .superRefine((data, ctx) => {
//   if (data.operator === 'REG' || data.operator === 'NREG') {
//     try {
//       new RegExp(data.value);
//     } catch (e) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: 'Invalid regular expression',
//       });
//     }
//   }
// });

export type LinkRuleAcceptLanguageCondition = z.infer<
  typeof LinkRuleAcceptLanguageConditionSchema
>;

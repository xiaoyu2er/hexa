import { z } from 'zod';
import type { RuleField } from '../field';
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
] as const satisfies RuleOperator[];
export const zLinkRuleAcceptLanguageOperator = z.enum(
  LINK_RULE_ACCEPT_LANGUAGE_OPERATORS
);
export type LinkRuleAcceptLanguageOperator = z.infer<
  typeof zLinkRuleAcceptLanguageOperator
>;

export const LinkRuleAcceptLanguageConditionSchema = z.object({
  field: z.literal(LINK_RULE_ACCEPT_LANGUAGE_FIELD),
  operator: zLinkRuleAcceptLanguageOperator,
  value: z.tuple([z.string(), z.string()]),
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

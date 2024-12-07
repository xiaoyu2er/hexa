import { z } from 'zod';
import { zContinentCode, zContinentCodeArray } from '../../continent';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_CONTINENT_FIELD =
  'CONTINENT' as const satisfies RuleField;

export const LINK_RULE_CONTINENT_OPERATORS = [
  'IN',
  'NOT_IN',
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];

export const zLinkRuleContinentOperator = z.enum(LINK_RULE_CONTINENT_OPERATORS);
export type LinkRuleContinentOperator = z.infer<
  typeof zLinkRuleContinentOperator
>;

export const LinkRuleContinentConditionSchema = z.object({
  field: z.literal(LINK_RULE_CONTINENT_FIELD),
  operator: zLinkRuleContinentOperator,
  value: z.union([zContinentCode, zContinentCodeArray]),
});
// .superRefine(refineOperator);

export type LinkRuleContinentCondition = z.infer<
  typeof LinkRuleContinentConditionSchema
>;

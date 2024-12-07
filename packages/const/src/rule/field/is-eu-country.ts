import { z } from 'zod';
import { zIsEUCountry } from '../../is-eu-country';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_IS_EU_COUNTRY_FIELD =
  'IS_EU_COUNTRY' as const satisfies RuleField;

export const LINK_RULE_IS_EU_COUNTRY_OPERATORS = [
  'EQ',
] as const satisfies RuleOperator[];

export const zLinkRuleIsEuCountryOperator = z.enum(
  LINK_RULE_IS_EU_COUNTRY_OPERATORS
);
export type LinkRuleIsEuCountryOperator = z.infer<
  typeof zLinkRuleIsEuCountryOperator
>;

export const LinkRuleIsEuCountryConditionSchema = z.object({
  field: z.literal(LINK_RULE_IS_EU_COUNTRY_FIELD),
  operator: zLinkRuleIsEuCountryOperator,
  value: zIsEUCountry,
});

export type LinkRuleIsEuCountryCondition = z.infer<
  typeof LinkRuleIsEuCountryConditionSchema
>;

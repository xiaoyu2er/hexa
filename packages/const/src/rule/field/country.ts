import { z } from 'zod';
import { CountrySelectOptions, zCountryCode } from '../../country';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_COUNTRY_FIELD = 'COUNTRY' as const satisfies RuleField;

export const LINK_RULE_COUNTRY_OPERATORS = [
  'IN',
  'NOT_IN',
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];

export const LINK_RULE_COUNTRY_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
    { operator: 'IN', defaultValue: [] },
    { operator: 'NOT_IN', defaultValue: [] },
  ],
  valueType: (operator) =>
    operator === 'EQ' || operator === 'NEQ'
      ? { type: 'SELECT', props: { options: CountrySelectOptions } }
      : { type: 'MULTI_SELECT', props: { options: CountrySelectOptions } },
};

export const zLinkRuleCountryOperator = z.enum(LINK_RULE_COUNTRY_OPERATORS);
export type LinkRuleCountryOperator = z.infer<typeof zLinkRuleCountryOperator>;

export const LinkRuleCountryConditionSchema = z.object({
  field: z.literal(LINK_RULE_COUNTRY_FIELD),
  operator: zLinkRuleCountryOperator,
  value: z.union([zCountryCode, z.array(zCountryCode)]),
});

export type LinkRuleCountryCondition = z.infer<
  typeof LinkRuleCountryConditionSchema
>;

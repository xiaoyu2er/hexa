import { z } from 'zod';
import { ContinentSelectOptions, zContinentCode } from '../../continent';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_CONTINENT_FIELD =
  'CONTINENT' as const satisfies RuleField;

export const LINK_RULE_CONTINENT_OPERATORS = [
  'IN',
  'NOT_IN',
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];

export const LINK_RULE_CONTINENT_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'EQ', defaultValue: '' },
    { operator: 'NEQ', defaultValue: '' },
    { operator: 'IN', defaultValue: [] },
    { operator: 'NOT_IN', defaultValue: [] },
  ],
  valueType: (operator) =>
    operator === 'EQ' || operator === 'NEQ'
      ? { type: 'SELECT', props: { options: ContinentSelectOptions } }
      : { type: 'MULTI_SELECT', props: { options: ContinentSelectOptions } },
};

export const zLinkRuleContinentOperator = z.enum(LINK_RULE_CONTINENT_OPERATORS);
export type LinkRuleContinentOperator = z.infer<
  typeof zLinkRuleContinentOperator
>;

export const LinkRuleContinentConditionSchema = z.object({
  field: z.literal(LINK_RULE_CONTINENT_FIELD),
  operator: zLinkRuleContinentOperator,
  value: z.union([zContinentCode, z.array(zContinentCode)]),
});

export type LinkRuleContinentCondition = z.infer<
  typeof LinkRuleContinentConditionSchema
>;

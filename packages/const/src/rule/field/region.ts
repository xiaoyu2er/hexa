import { z } from 'zod';
import type { CountryCode } from '../../country';
import { RegionSelectOptionsMap } from '../../region';
import type { FieldConfig, RuleField } from '../field';
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

export const LINK_RULE_REGION_CODE_FIELD_CONFIG: FieldConfig = {
  operators: LINK_RULE_REGION_CODE_OPERATOR_CONFIGS,
  valueType: (operator, conditions) => {
    const country = conditions?.find(
      (c) => c.field === 'COUNTRY' && c.operator === 'EQ'
    );
    if (
      country?.value &&
      (country.value as CountryCode) in RegionSelectOptionsMap
    ) {
      return operator === 'EQ' || operator === 'NEQ'
        ? {
            type: 'SELECT',
            props: {
              options:
                RegionSelectOptionsMap[
                  country.value as keyof typeof RegionSelectOptionsMap
                ],
            },
          }
        : {
            type: 'MULTI_SELECT',
            props: {
              options:
                RegionSelectOptionsMap[
                  country.value as keyof typeof RegionSelectOptionsMap
                ],
            },
          };
    }
    return { type: 'INPUT' };
  },
};

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

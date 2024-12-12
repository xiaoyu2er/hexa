import { z } from 'zod';
import { SourceSelectOptions, zSourceCode } from '../../source';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_SOURCE_FIELD = 'SOURCE' as const satisfies RuleField;
export const LINK_RULE_SOURCE_OPERATORS = [
  'EQ',
] as const satisfies RuleOperator[];

export const LINK_RULE_SOURCE_FIELD_CONFIG: FieldConfig = {
  operators: [{ operator: 'EQ', defaultValue: '' }],
  valueType: () => ({
    type: 'SELECT',
    props: { options: SourceSelectOptions },
  }),
};

export const zLinkRuleSourceOperator = z.enum(LINK_RULE_SOURCE_OPERATORS);
export type LinkRuleSourceOperator = z.infer<typeof zLinkRuleSourceOperator>;

export const LinkRuleSourceConditionSchema = z.object({
  field: z.literal(LINK_RULE_SOURCE_FIELD),
  operator: zLinkRuleSourceOperator,
  value: zSourceCode,
});

export type LinkRuleSourceCondition = z.infer<
  typeof LinkRuleSourceConditionSchema
>;

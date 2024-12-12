import { z } from 'zod';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_COOKIE_FIELD = 'COOKIE' as const satisfies RuleField;

export const LINK_RULE_COOKIE_OPERATORS = [
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];

export const LINK_RULE_COOKIE_FIELD_CONFIG: FieldConfig = {
  subField: {
    type: 'INPUT',
    props: {
      placeholder: 'Cookie Name',
    },
  },
  operators: [
    {
      operator: 'EQ',
      defaultValue: '',
    },
    {
      operator: 'NEQ',
      defaultValue: '',
    },
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

export const zLinkRuleCookieOperator = z.enum(LINK_RULE_COOKIE_OPERATORS);
export type LinkRuleCookieOperator = z.infer<typeof zLinkRuleCookieOperator>;

export const LinkRuleCookieConditionSchema = z.object({
  field: z.literal(LINK_RULE_COOKIE_FIELD),
  subField: z.string().min(1).max(255),
  operator: zLinkRuleCookieOperator,
  value: z.string().min(1),
});

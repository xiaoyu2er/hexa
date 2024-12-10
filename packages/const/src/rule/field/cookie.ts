import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator, RuleOperatorConfigs } from '../operator';

export const LINK_RULE_COOKIE_FIELD = 'COOKIE' as const satisfies RuleField;

export const LINK_RULE_COOKIE_OPERATORS = [
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];
export const LINK_RULE_COOKIE_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  {
    operator: 'EQ',
    defaultValue: '',
  },
  {
    operator: 'NEQ',
    defaultValue: '',
  },
] as const;
export const zLinkRuleCookieOperator = z.enum(LINK_RULE_COOKIE_OPERATORS);
export type LinkRuleCookieOperator = z.infer<typeof zLinkRuleCookieOperator>;

export const LinkRuleCookieConditionSchema = z.object({
  field: z.literal(LINK_RULE_COOKIE_FIELD),
  operator: zLinkRuleCookieOperator,
  value: z.string(),
});

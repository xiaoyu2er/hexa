import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_COOKIE_FIELD = 'COOKIE' as const satisfies RuleField;

export const LINK_RULE_COOKIE_OPERATORS = [
  'EQ',
  'NEQ',
] as const satisfies RuleOperator[];
export const zLinkRuleCookieOperator = z.enum(LINK_RULE_COOKIE_OPERATORS);
export type LinkRuleCookieOperator = z.infer<typeof zLinkRuleCookieOperator>;

export const LinkRuleCookieConditionSchema = z.object({
  field: z.literal(LINK_RULE_COOKIE_FIELD),
  operator: zLinkRuleCookieOperator,
  value: z.string(),
});

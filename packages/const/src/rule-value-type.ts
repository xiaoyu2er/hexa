import z from 'zod';

export const RULE_VALUE_TYPE_CODES = [
  'INPUT',
  'FLOAT',
  'INTEGER',
  'REGEX',
  'SELECT',
  'TIME',
  'MULTI_SELECT',
] as const;

export const zRuleValueTypeCode = z.enum(RULE_VALUE_TYPE_CODES);
export type RuleValueTypeCode = z.infer<typeof zRuleValueTypeCode>;

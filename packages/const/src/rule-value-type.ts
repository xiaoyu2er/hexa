import z from 'zod';

export const RULE_VALUE_TYPE_CODES = [
  'INPUT',
  'SELECT',
  'TIME',
  'MULTI_SELECT',
] as const;

export const zRuleValueTypeCode = z.enum(RULE_VALUE_TYPE_CODES);
export type RuleValueTypeCode = z.infer<typeof zRuleValueTypeCode>;

export const RULE_VALUE_TYPES = {
  INPUT: 'Input',
  SELECT: 'Select',
  TIME: 'Time',
  MULTI_SELECT: 'MultiSelect',
} as const;

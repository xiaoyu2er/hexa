import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator, RuleOperatorConfigs } from '../operator';

export const LINK_RULE_LATITUDE_FIELD = 'LATITUDE' as const satisfies RuleField;

export const LINK_RULE_LATITUDE_OPERATORS = [
  'LT',
  'LE',
  'GT',
  'GE',
  'BETWEEN',
  'NOT_BETWEEN',
] as const satisfies RuleOperator[];

export const LINK_RULE_LATITUDE_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  { operator: 'LT', defaultValue: 0 },
  { operator: 'LE', defaultValue: 0 },
  { operator: 'GT', defaultValue: 0 },
  { operator: 'GE', defaultValue: 0 },
  { operator: 'BETWEEN', defaultValue: [] },
  { operator: 'NOT_BETWEEN', defaultValue: [] },
];

export const zLinkRuleLatitudeOperator = z.enum(LINK_RULE_LATITUDE_OPERATORS);
export type LinkRuleLatitudeOperator = z.infer<
  typeof zLinkRuleLatitudeOperator
>;

export const LinkRuleLatitudeConditionSchema = z.object({
  field: z.literal(LINK_RULE_LATITUDE_FIELD),
  operator: zLinkRuleLatitudeOperator,
  value: z.number().superRefine((value, ctx) => {
    if (value < -90 || value > 90) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Latitude must be between -90 and 90',
      });
    }
  }),
});

export type LinkRuleLatitudeCondition = z.infer<
  typeof LinkRuleLatitudeConditionSchema
>;

export const LINK_RULE_LONGITUDE_FIELD =
  'LONGITUDE' as const satisfies RuleField;

export const LINK_RULE_LONGITUDE_OPERATORS = [
  'LT',
  'LE',
  'GT',
  'GE',
  'BETWEEN',
  'NOT_BETWEEN',
] as const satisfies RuleOperator[];

export const LINK_RULE_LONGITUDE_OPERATOR_CONFIGS: RuleOperatorConfigs = [
  { operator: 'LT', defaultValue: 0 },
  { operator: 'LE', defaultValue: 0 },
  { operator: 'GT', defaultValue: 0 },
  { operator: 'GE', defaultValue: 0 },
  { operator: 'BETWEEN', defaultValue: [] },
  { operator: 'NOT_BETWEEN', defaultValue: [] },
];

export const zLinkRuleLongitudeOperator = z.enum(LINK_RULE_LONGITUDE_OPERATORS);
export type LinkRuleLongitudeOperator = z.infer<
  typeof zLinkRuleLongitudeOperator
>;

export const LinkRuleLongitudeConditionSchema = z.object({
  field: z.literal(LINK_RULE_LONGITUDE_FIELD),
  operator: zLinkRuleLongitudeOperator,
  value: z.number().superRefine((value, ctx) => {
    if (value < -180 || value > 180) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Longitude must be between -180 and 180',
      });
    }
  }),
});

export type LinkRuleLongitudeCondition = z.infer<
  typeof LinkRuleLongitudeConditionSchema
>;

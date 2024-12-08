import { z } from 'zod';
import type { RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_LATITUDE_FIELD = 'LATITUDE' as const satisfies RuleField;

export const LINK_RULE_LATITUDE_OPERATORS = [
  'LT',
  'LE',
  'GT',
  'GE',
] as const satisfies RuleOperator[];

export const zLinkRuleLatitudeOperator = z.enum(LINK_RULE_LATITUDE_OPERATORS);
export type LinkRuleLatitudeOperator = z.infer<
  typeof zLinkRuleLatitudeOperator
>;

export const LinkRuleLatitudeConditionSchema = z.object({
  field: z.literal(LINK_RULE_LATITUDE_FIELD),
  operator: zLinkRuleLatitudeOperator,
  value: z
    .union([z.string(), z.number()])
    .transform((value) =>
      typeof value === 'string' ? Number.parseFloat(value) : value
    )
    .superRefine((value, ctx) => {
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
] as const satisfies RuleOperator[];

export const zLinkRuleLongitudeOperator = z.enum(LINK_RULE_LONGITUDE_OPERATORS);
export type LinkRuleLongitudeOperator = z.infer<
  typeof zLinkRuleLongitudeOperator
>;

export const LinkRuleLongitudeConditionSchema = z.object({
  field: z.literal(LINK_RULE_LONGITUDE_FIELD),
  operator: zLinkRuleLongitudeOperator,
  value: z
    .union([z.string(), z.number()])
    .transform((value) =>
      typeof value === 'string' ? Number.parseFloat(value) : value
    )
    .superRefine((value, ctx) => {
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

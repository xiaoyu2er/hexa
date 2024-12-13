import { z } from 'zod';
import type { FieldConfig, RuleField } from '../field';
import type { RuleOperator } from '../operator';

export const LINK_RULE_LATITUDE_FIELD = 'LATITUDE' as const satisfies RuleField;

export const LINK_RULE_LATITUDE_OPERATORS = [
  'LT',
  'LE',
  'GT',
  'GE',
  'BETWEEN',
  'NOT_BETWEEN',
] as const satisfies RuleOperator[];

export const LINK_RULE_LATITUDE_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'LT', defaultValue: '' },
    { operator: 'LE', defaultValue: '' },
    { operator: 'GT', defaultValue: '' },
    { operator: 'GE', defaultValue: '' },
    { operator: 'BETWEEN', defaultValue: { min: '', max: '' } },
    { operator: 'NOT_BETWEEN', defaultValue: { min: '', max: '' } },
  ],
  valueType: (operator) =>
    operator === 'BETWEEN' || operator === 'NOT_BETWEEN'
      ? {
          type: 'FLOAT_BETWEEN',
          props: { min: -90, max: 90, type: 'number' },
        }
      : {
          type: 'FLOAT',
          props: { min: -90, max: 90, type: 'number' },
        },
};

export const zLinkRuleLatitudeOperator = z.enum(LINK_RULE_LATITUDE_OPERATORS);
export type LinkRuleLatitudeOperator = z.infer<
  typeof zLinkRuleLatitudeOperator
>;

export const LinkRuleLatitudeConditionSchema = z.object({
  field: z.literal(LINK_RULE_LATITUDE_FIELD),
  operator: zLinkRuleLatitudeOperator,
  value: z.union([
    z.object({ min: z.number(), max: z.number() }).superRefine((value, ctx) => {
      if (value.min < -90 || value.min > 90) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Latitude must be between -90 and 90',
          path: ['min'],
        });
      }
      if (value.max < -90 || value.max > 90) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Latitude must be between -90 and 90',
          path: ['max'],
        });
      }
      if (value.min >= value.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min value must be less than max value',
          path: ['min'],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min value must be less than max value',
          path: ['max'],
        });
      }
    }),
    z.number().superRefine((value, ctx) => {
      if (value < -90 || value > 90) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Latitude must be between -90 and 90',
        });
      }
    }),
  ]),
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

export const LINK_RULE_LONGITUDE_FIELD_CONFIG: FieldConfig = {
  operators: [
    { operator: 'LT', defaultValue: '' },
    { operator: 'LE', defaultValue: '' },
    { operator: 'GT', defaultValue: '' },
    { operator: 'GE', defaultValue: '' },
    { operator: 'BETWEEN', defaultValue: { min: '', max: '' } },
    { operator: 'NOT_BETWEEN', defaultValue: { min: '', max: '' } },
  ],
  valueType: (operator) =>
    operator === 'BETWEEN' || operator === 'NOT_BETWEEN'
      ? {
          type: 'FLOAT_BETWEEN',
          props: { min: -180, max: 180, type: 'number' },
        }
      : {
          type: 'FLOAT',
          props: { min: -180, max: 180, type: 'number' },
        },
};

export const zLinkRuleLongitudeOperator = z.enum(LINK_RULE_LONGITUDE_OPERATORS);
export type LinkRuleLongitudeOperator = z.infer<
  typeof zLinkRuleLongitudeOperator
>;

export const LinkRuleLongitudeConditionSchema = z.object({
  field: z.literal(LINK_RULE_LONGITUDE_FIELD),
  operator: zLinkRuleLongitudeOperator,
  value: z.union([
    z.object({ min: z.number(), max: z.number() }).superRefine((value, ctx) => {
      if (value.min < -180 || value.min > 180) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Longitude must be between -180 and 180',
          path: ['min'],
        });
      }
      if (value.max < -180 || value.max > 180) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Longitude must be between -180 and 180',
          path: ['max'],
        });
      }
      if (value.min >= value.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min value must be less than max value',
          path: ['min'],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min value must be less than max value',
          path: ['max'],
        });
      }
    }),
    z.number().superRefine((value, ctx) => {
      if (value < -180 || value > 180) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Longitude must be between -180 and 180',
        });
      }
    }),
  ]),
});

export type LinkRuleLongitudeCondition = z.infer<
  typeof LinkRuleLongitudeConditionSchema
>;

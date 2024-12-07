import { z } from 'zod';

export const RULE_OPERATOR_CODES = [
  'EQ',
  'NEQ',
  'LT',
  'LE',
  'GT',
  'GE',
  'CONTAINS',
  'NOT_CONTAINS',
  'REG',
  'NREG',
  'IN',
  'NOT_IN',
] as const;

export const RULE_OPERATORS = {
  EQ: 'Equals',
  NEQ: 'Not equals',
  LT: 'Less than',
  LE: 'Less than or equal',
  GT: 'Greater than',
  GE: 'Greater than or equal',
  CONTAINS: 'Contains',
  NOT_CONTAINS: 'Not contains',
  REG: 'Matches regex',
  NREG: 'Not matches regex',
  IN: 'In',
  NOT_IN: 'Not in',
} as const;

export const zRuleArrayOperatorEnum = z.enum(['IN', 'NOT_IN'], {
  message: 'Please select an operator',
});

export const zRuleNonArrayOperatorEnum = z.enum(
  [
    'EQ',
    'NEQ',
    'LT',
    'LE',
    'GT',
    'GE',
    'CONTAINS',
    'NOT_CONTAINS',
    'REG',
    'NREG',
  ],
  {
    message: 'Please select an operator',
  }
);

export const zRuleOperatorEnum = z.enum(RULE_OPERATOR_CODES, {
  message: 'Please select an operator',
});
export type RuleOperator = z.infer<typeof zRuleOperatorEnum>;

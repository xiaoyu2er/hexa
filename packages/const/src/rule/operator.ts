import { z } from 'zod';

export const RULE_OPERATOR_CODES = [
  'EQ',
  'NEQ',
  'LT',
  'LE',
  'GT',
  'GE',
  'BETWEEN',
  'NOT_BETWEEN',
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
  BETWEEN: 'Between',
  NOT_BETWEEN: 'Not between',
  CONTAINS: 'Contains',
  NOT_CONTAINS: 'Not contains',
  REG: 'Matches regex',
  NREG: 'Not matches regex',
  IN: 'In',
  NOT_IN: 'Not in',
} as const;

export const TWO_VALUE_OPERATORS = ['BETWEEN', 'NOT_BETWEEN', 'REG', 'NREG'];

export const ARRAY_OPERATORS = ['IN', 'NOT_IN'];

export const ONE_VALUE_OPERATORS = [
  'EQ',
  'NEQ',
  'LT',
  'LE',
  'GT',
  'GE',
  'CONTAINS',
  'NOT_CONTAINS',
];

export type RuleOperatorConfig = {
  operator: RuleOperator;
  defaultValue: unknown;
};

export type RuleOperatorConfigs = RuleOperatorConfig[];

export const zRuleOperatorEnum = z.enum(RULE_OPERATOR_CODES, {
  message: 'Please select an operator',
});
export type RuleOperator = z.infer<typeof zRuleOperatorEnum>;

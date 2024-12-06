import type { Simplify } from 'type-fest';
import { z } from 'zod';
import { ContinentSelectOptions } from './continent';
import {
  type CountryCode,
  CountrySelectOptions,
  IsEUCountrySelectOptions,
} from './country';
import { RegionSelectOptionsMap } from './region';
import type { SelectOptions } from './select-option';
import type { CheckObjectValuesContainAll } from './type-check';
// https://developers.cloudflare.com/ruleset-engine/rules-language/operators/#comparison-operators
// https://openflagr.github.io/flagr/api_docs/#operation/createFlag

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

export const zRuleOperatorEnum = z.enum(RULE_OPERATOR_CODES);
export type RuleOperator = z.infer<typeof zRuleOperatorEnum>;

export const RULE_FIELD_CODES = [
  'TIME',
  // ===== Request Headers =====
  'REFERER',
  'IP',
  'SOURCE',
  'LANGUAGE',
  'QUERY',
  'SOURCE',

  // ====== User agent ======
  'USER_AGENT',
  // Browser
  'BROWSER_NAME',
  'BROWSER_VERSION',
  'BROWSER_MAJOR',
  'BROWSER_TYPE',
  // Device
  'DEVICE_TYPE',
  'DEVICE_VENDOR',
  'DEVICE_MODEL',
  // OS
  'OS_NAME',
  'OS_VERSION',
  // CPU
  'CPU',
  // ======== Location ========
  'CONTINENT',
  'COUNTRY',
  'IS_EU_COUNTRY',
  'REGION_CODE',
  'LATITUDE',
  'LONGITUDE',
  'TIMEZONE',
  'POSTAL_CODE',
] as const;

export const RULE_FIELDS: Record<RuleField, string> = {
  TIME: 'Time',
  REFERER: 'Referer',
  IP: 'IP',
  SOURCE: 'Source',
  LANGUAGE: 'Language',
  QUERY: 'Query',
  USER_AGENT: 'User agent',
  BROWSER_NAME: 'Browser name',
  BROWSER_VERSION: 'Browser version',
  BROWSER_MAJOR: 'Browser major',
  BROWSER_TYPE: 'Browser type',
  DEVICE_TYPE: 'Device type',
  DEVICE_VENDOR: 'Device vendor',
  DEVICE_MODEL: 'Device model',
  OS_NAME: 'OS name',
  OS_VERSION: 'OS version',
  CPU: 'CPU',
  CONTINENT: 'Continent',
  COUNTRY: 'Country',
  IS_EU_COUNTRY: 'EU country',
  REGION_CODE: 'Region',
  LATITUDE: 'Latitude',
  LONGITUDE: 'Longitude',
  TIMEZONE: 'Timezone',
  POSTAL_CODE: 'Postal code',
} as const;

export const RULE_FIELD_SELECT_OPTIONS = [
  {
    label: 'Time',
    options: [{ label: RULE_FIELDS.TIME, value: 'TIME' }],
  },
  {
    label: 'Location',
    options: [
      { label: RULE_FIELDS.CONTINENT, value: 'CONTINENT' },
      { label: RULE_FIELDS.COUNTRY, value: 'COUNTRY' },
      { label: RULE_FIELDS.IS_EU_COUNTRY, value: 'IS_EU_COUNTRY' },
      { label: RULE_FIELDS.REGION_CODE, value: 'REGION_CODE' },
      { label: RULE_FIELDS.POSTAL_CODE, value: 'POSTAL_CODE' },
      { label: RULE_FIELDS.TIMEZONE, value: 'TIMEZONE' },
      { label: RULE_FIELDS.LATITUDE, value: 'LATITUDE' },
      { label: RULE_FIELDS.LONGITUDE, value: 'LONGITUDE' },
    ],
  },
  {
    label: 'Request headers',
    options: [
      { label: RULE_FIELDS.REFERER, value: 'REFERER' },
      { label: RULE_FIELDS.IP, value: 'IP' },
      { label: RULE_FIELDS.SOURCE, value: 'SOURCE' },
      { label: RULE_FIELDS.LANGUAGE, value: 'LANGUAGE' },
      { label: RULE_FIELDS.QUERY, value: 'QUERY' },
      { label: RULE_FIELDS.SOURCE, value: 'SOURCE' },
    ],
  },
  {
    label: 'User agent',
    options: [
      { label: RULE_FIELDS.USER_AGENT, value: 'USER_AGENT' },
      { label: RULE_FIELDS.BROWSER_NAME, value: 'BROWSER_NAME' },
      { label: RULE_FIELDS.BROWSER_VERSION, value: 'BROWSER_VERSION' },
      { label: RULE_FIELDS.BROWSER_MAJOR, value: 'BROWSER_MAJOR' },
      { label: RULE_FIELDS.BROWSER_TYPE, value: 'BROWSER_TYPE' },
      { label: RULE_FIELDS.DEVICE_TYPE, value: 'DEVICE_TYPE' },
      { label: RULE_FIELDS.DEVICE_VENDOR, value: 'DEVICE_VENDOR' },
      { label: RULE_FIELDS.DEVICE_MODEL, value: 'DEVICE_MODEL' },
      { label: RULE_FIELDS.OS_NAME, value: 'OS_NAME' },
      { label: RULE_FIELDS.OS_VERSION, value: 'OS_VERSION' },
      { label: RULE_FIELDS.CPU, value: 'CPU' },
    ],
  },
] as const satisfies SelectOptions<RuleField>;

// For checking objects with value property (like select options)
type _ensureNoMissingFields = CheckObjectValuesContainAll<
  (typeof RULE_FIELD_CODES)[number],
  typeof RULE_FIELD_SELECT_OPTIONS
>;
const _checkMissingFields: _ensureNoMissingFields = true;

export const zRuleFieldEnum = z.enum(RULE_FIELD_CODES);
export type RuleField = z.infer<typeof zRuleFieldEnum>;

export const RULE_FIELD_OPERATOR_MAP: Record<RuleField, RuleOperator[]> = {
  TIME: ['LT', 'LE', 'GT', 'GE'],
  // Request headers
  REFERER: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  IP: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  SOURCE: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  LANGUAGE: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  QUERY: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  // User agent
  USER_AGENT: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
  BROWSER_NAME: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  BROWSER_VERSION: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  BROWSER_MAJOR: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  BROWSER_TYPE: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  DEVICE_TYPE: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  DEVICE_VENDOR: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  DEVICE_MODEL: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  OS_NAME: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  OS_VERSION: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  CPU: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
  // Location
  CONTINENT: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
  COUNTRY: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
  IS_EU_COUNTRY: ['EQ'],
  REGION_CODE: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
  LATITUDE: ['EQ', 'NEQ', 'LT', 'LE', 'GT', 'GE'],
  LONGITUDE: ['EQ', 'NEQ', 'LT', 'LE', 'GT', 'GE'],
  TIMEZONE: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
  POSTAL_CODE: [
    'EQ',
    'NEQ',
    'IN',
    'NOT_IN',
    'CONTAINS',
    'NOT_CONTAINS',
    'REG',
    'NREG',
  ],
};

/**
 * Get operator select options for a given field using the operator map
 * For example, if the field is 'CONTINENT', the options will be
 * [
 *  {label: 'In', value: 'IN'},
 *  {label: 'Not in', value: 'NOT_IN'},
 *  {label: 'Equals', value: 'EQ'},
 *  {label: 'Not equals', value: 'NEQ'},
 * ]
 */
export const getOperatorSelectOptions = (field?: RuleField) => {
  if (!field) {
    return [];
  }
  return RULE_FIELD_OPERATOR_MAP[field].map((operator) => {
    return { label: RULE_OPERATORS[operator], value: operator };
  });
};

export const getValueInputType = (
  field?: RuleField,
  operator?: RuleOperator
) => {
  if (!field) {
    return 'text';
  }
  if (!operator) {
    return 'text';
  }
  if (field === 'TIME') {
    return 'time';
  }

  switch (operator) {
    case 'IN':
    case 'NOT_IN':
      return 'multi-select';
    case 'EQ':
    case 'NEQ':
      return field === 'CONTINENT' ||
        field === 'COUNTRY' ||
        field === 'IS_EU_COUNTRY' ||
        field === 'REGION_CODE'
        ? 'select'
        : 'text';
    default:
      return 'text';
  }
};

export const getValueOptions = (
  field?: RuleField,
  operator?: RuleOperator,
  conditions?: LinkRuleCondition[]
) => {
  if (!field) {
    return [];
  }
  if (!operator) {
    return [];
  }
  if (field === 'CONTINENT') {
    switch (operator) {
      case 'IN':
      case 'NOT_IN':
      case 'EQ':
      case 'NEQ':
        return ContinentSelectOptions;
      default:
        return [];
    }
  }
  if (field === 'COUNTRY') {
    switch (operator) {
      case 'IN':
      case 'NOT_IN':
      case 'EQ':
      case 'NEQ':
        return [{ label: 'All countries', options: CountrySelectOptions }];
      default:
        return [];
    }
  }

  if (field === 'IS_EU_COUNTRY') {
    switch (operator) {
      case 'EQ':
      case 'NEQ':
        return IsEUCountrySelectOptions;
    }
  }

  if (field === 'REGION_CODE') {
    const country = conditions?.find(
      (c) => c.field === 'COUNTRY' && c.operator === 'EQ'
    );
    if (
      country?.value &&
      (country.value as CountryCode) in RegionSelectOptionsMap
    ) {
      return (
        RegionSelectOptionsMap[
          country.value as keyof typeof RegionSelectOptionsMap
        ] ?? []
      );
    }
  }

  return [];
};

export const LinkRuleConditionSchema = z.object({
  field: zRuleFieldEnum,
  operator: zRuleOperatorEnum,
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.array(z.number()),
  ]),
});
export type LinkRuleCondition = Simplify<
  z.infer<typeof LinkRuleConditionSchema>
>;

export const LinkRuleSchema = z.object({
  conditions: z.array(LinkRuleConditionSchema),
  destUrl: z.string().url(),
});

export type LinkRule = Simplify<z.infer<typeof LinkRuleSchema>>;

export const RulesSchema = z.object({
  rules: z.array(LinkRuleSchema),
});

export type RulesFormType = z.infer<typeof RulesSchema>;

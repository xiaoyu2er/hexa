import type { Simplify } from 'type-fest';
import { z } from 'zod';
import { ContinentSelectOptions } from './continent';
import {
  type CountryCode,
  CountrySelectOptions,
  IsEUCountrySelectOptions,
} from './country';
import { DeviceTypeSelectOptions } from './device-type';
import { RegionSelectOptionsMap } from './region';
import type { RuleValueTypeCode } from './rule-value-type';
import type { SelectOptions } from './select-option';
import { SourceSelectOptions } from './source';
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
  'ACCEPT_LANGUAGE',
  'QUERY',

  // ====== User agent ======
  'USER_AGENT',
  // Browser
  // 'BROWSER_NAME',
  // 'BROWSER_VERSION',
  // 'BROWSER_MAJOR',
  // 'BROWSER_TYPE',
  // Device
  'DEVICE_TYPE',
  // 'DEVICE_VENDOR',
  // 'DEVICE_MODEL',
  // OS
  // 'OS_NAME',
  // 'OS_VERSION',
  // CPU
  // 'CPU',
  // ======== Location ========
  'CONTINENT',
  'COUNTRY',
  'IS_EU_COUNTRY',
  'REGION_CODE',
  'LATITUDE',
  'LONGITUDE',
  // 'TIMEZONE',
  'POSTAL_CODE',
] as const;

export const RULE_FIELDS: Record<RuleField, string> = {
  TIME: 'Time',
  REFERER: 'Referer',
  IP: 'IP',
  SOURCE: 'Source',
  ACCEPT_LANGUAGE: 'Accept-Language',
  QUERY: 'Query',
  USER_AGENT: 'User agent',
  // BROWSER_NAME: 'Browser name',
  // BROWSER_VERSION: 'Browser version',
  // BROWSER_MAJOR: 'Browser major',
  // BROWSER_TYPE: 'Browser type',
  DEVICE_TYPE: 'Device type',
  // DEVICE_VENDOR: 'Device vendor',
  // DEVICE_MODEL: 'Device model',
  // OS_NAME: 'OS name',
  // OS_VERSION: 'OS version',
  // CPU: 'CPU',
  CONTINENT: 'Continent',
  COUNTRY: 'Country',
  IS_EU_COUNTRY: 'EU country',
  REGION_CODE: 'Region',
  LATITUDE: 'Latitude',
  LONGITUDE: 'Longitude',
  // TIMEZONE: 'Timezone',
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
      { label: RULE_FIELDS.ACCEPT_LANGUAGE, value: 'ACCEPT_LANGUAGE' },
      { label: RULE_FIELDS.QUERY, value: 'QUERY' },
      { label: RULE_FIELDS.SOURCE, value: 'SOURCE' },
    ],
  },
  {
    label: 'User agent',
    options: [
      { label: RULE_FIELDS.USER_AGENT, value: 'USER_AGENT' },
      { label: RULE_FIELDS.DEVICE_TYPE, value: 'DEVICE_TYPE' },
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

export const FIELD_OPERATOR_CONFIGS: Record<
  RuleField,
  {
    operators: RuleOperator[];
    valueType: (
      operator: RuleOperator,
      conditions: LinkRuleCondition[]
    ) => RuleValueTypeCode;
    valueOptions?: (conditions: LinkRuleCondition[]) => SelectOptions<string>;
  }
> = {
  TIME: {
    operators: ['LT', 'LE', 'GT', 'GE'],
    valueType: () => 'TIME',
  },
  REFERER: {
    operators: ['CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
    valueType: () => 'INPUT',
  },
  IP: {
    operators: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
    valueType: () => 'INPUT',
  },

  SOURCE: {
    operators: ['EQ'],
    valueType: () => 'SELECT',
    valueOptions: () => SourceSelectOptions,
  },

  ACCEPT_LANGUAGE: {
    operators: ['EQ', 'NEQ', 'CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
    valueType: () => 'INPUT',
  },
  QUERY: {
    operators: ['EQ', 'NEQ', 'CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
    valueType: () => 'INPUT',
  },
  USER_AGENT: {
    operators: ['EQ', 'NEQ', 'CONTAINS', 'NOT_CONTAINS', 'REG', 'NREG'],
    valueType: () => 'INPUT',
  },

  DEVICE_TYPE: {
    operators: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
    valueType: (operator) =>
      operator === 'EQ' || operator === 'NEQ' ? 'SELECT' : 'MULTI_SELECT',
    valueOptions: () => DeviceTypeSelectOptions,
  },

  CONTINENT: {
    operators: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
    valueType: (operator) =>
      operator === 'EQ' || operator === 'NEQ' ? 'SELECT' : 'MULTI_SELECT',
    valueOptions: () => ContinentSelectOptions,
  },
  COUNTRY: {
    operators: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
    valueType: (operator) =>
      operator === 'EQ' || operator === 'NEQ' ? 'SELECT' : 'MULTI_SELECT',
    valueOptions: () => CountrySelectOptions,
  },
  IS_EU_COUNTRY: {
    operators: ['EQ'],
    valueType: () => 'SELECT',
    valueOptions: () => IsEUCountrySelectOptions,
  },
  REGION_CODE: {
    operators: ['IN', 'NOT_IN', 'EQ', 'NEQ'],
    valueType: (operator, conditions) => {
      const country = conditions?.find(
        (c) => c.field === 'COUNTRY' && c.operator === 'EQ'
      );
      if (
        country?.value &&
        (country.value as CountryCode) in RegionSelectOptionsMap
      ) {
        return operator === 'EQ' || operator === 'NEQ'
          ? 'SELECT'
          : 'MULTI_SELECT';
      }
      return 'INPUT';
    },
    valueOptions: (conditions) => {
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
          ] ?? null
        );
      }
      return [];
    },
  },
  LATITUDE: {
    operators: ['LT', 'LE', 'GT', 'GE'],
    valueType: () => 'INPUT',
  },
  LONGITUDE: {
    operators: ['LT', 'LE', 'GT', 'GE'],
    valueType: () => 'INPUT',
  },
  POSTAL_CODE: {
    operators: [
      'EQ',
      'NEQ',
      'IN',
      'NOT_IN',
      'CONTAINS',
      'NOT_CONTAINS',
      'REG',
      'NREG',
    ],
    valueType: () => 'INPUT',
  },
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

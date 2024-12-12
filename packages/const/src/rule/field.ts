import { z } from 'zod';
import type { LinkRuleCondition } from '.';
import type { RuleValueTypeCode } from '../rule-value-type';
import type { RuleOperator, RuleOperatorConfigs } from './operator';

export const RULE_FIELD_CODES = [
  'TIME',
  // ===== Request Headers =====
  'REFERER',
  'IP',
  'SOURCE',
  'ACCEPT_LANGUAGE',
  'QUERY',
  'COOKIE',
  // ====== User agent ======
  'USER_AGENT',
  // Device
  'DEVICE_TYPE',
  // ======== Location ========
  'CONTINENT',
  'COUNTRY',
  'IS_EU_COUNTRY',
  'REGION_CODE',
  'LATITUDE',
  'LONGITUDE',
  'POSTAL_CODE',
] as const;

export const zRuleFieldEnum = z.enum(RULE_FIELD_CODES, {
  message: 'Please select a field',
});
export type RuleField = z.infer<typeof zRuleFieldEnum>;

export const RULE_FIELDS: Record<RuleField, string> = {
  TIME: 'Time',
  REFERER: 'Referer',
  IP: 'IP',
  SOURCE: 'Source',
  ACCEPT_LANGUAGE: 'Accept-Language',
  QUERY: 'Query',
  USER_AGENT: 'User agent',
  COOKIE: 'Cookie',
  DEVICE_TYPE: 'Device type',
  CONTINENT: 'Continent',
  COUNTRY: 'Country',
  IS_EU_COUNTRY: 'Is EU country',
  REGION_CODE: 'Region',
  LATITUDE: 'Latitude',
  LONGITUDE: 'Longitude',
  POSTAL_CODE: 'Postal code',
} as const;

// Fields that can appear multiple times in AND conditions
const MULTI_USE_FIELDS: RuleField[] = ['QUERY', 'COOKIE'] as const;

export const getRuleFieldSelectOptions = (
  conditions: LinkRuleCondition[],
  currentField?: RuleField
) => {
  // Track single-use fields that are already in conditions
  // Excludes multi-use fields (QUERY, COOKIE) and the current field being edited
  const shouldHideMap = conditions.reduce(
    (acc, condition) => {
      if (
        !MULTI_USE_FIELDS.includes(condition.field) &&
        condition.field !== currentField
      ) {
        acc[condition.field] = true;
      }
      return acc;
    },
    {} as Record<RuleField, boolean>
  );

  // Find if there's a country condition with equals operator
  const hasCountry = conditions.some(
    (condition) =>
      condition.field === 'COUNTRY' &&
      condition.operator === 'EQ' &&
      condition.value?.length === 2
  );

  // If no country equals condition exists, mark REGION_CODE as used
  if (hasCountry && currentField !== 'REGION_CODE') {
    shouldHideMap.REGION_CODE = false;
  } else {
    shouldHideMap.REGION_CODE = true;
  }

  return [
    {
      label: 'Time',
      options: [{ label: RULE_FIELDS.TIME, value: 'TIME' }].filter(
        (option) => !shouldHideMap[option.value as RuleField]
      ),
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
      ].filter((option) => !shouldHideMap[option.value as RuleField]),
    },
    {
      label: 'Request headers',
      options: [
        { label: RULE_FIELDS.REFERER, value: 'REFERER' },
        { label: RULE_FIELDS.IP, value: 'IP' },
        { label: RULE_FIELDS.SOURCE, value: 'SOURCE' },
        { label: RULE_FIELDS.ACCEPT_LANGUAGE, value: 'ACCEPT_LANGUAGE' },
        { label: RULE_FIELDS.QUERY, value: 'QUERY' },
        { label: RULE_FIELDS.COOKIE, value: 'COOKIE' },
      ].filter((option) => !shouldHideMap[option.value as RuleField]),
    },
    {
      label: 'User agent',
      options: [
        { label: RULE_FIELDS.USER_AGENT, value: 'USER_AGENT' },
        { label: RULE_FIELDS.DEVICE_TYPE, value: 'DEVICE_TYPE' },
      ].filter((option) => !shouldHideMap[option.value as RuleField]),
    },
  ].filter((group) => group.options.length > 0); // Remove groups with no options
};

export type ValueType = {
  props?: Record<string, unknown>;
  type: RuleValueTypeCode;
};

export type FieldConfig = {
  subField?: ValueType;
  operators: RuleOperatorConfigs;
  valueType: (
    operator: RuleOperator,
    conditions: LinkRuleCondition[]
  ) => ValueType;
};

import { z } from 'zod';
import type { SelectOptions } from '../select-option';
import type { CheckObjectValuesContainAll } from '../type-check';

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
      { label: RULE_FIELDS.COOKIE, value: 'COOKIE' },
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

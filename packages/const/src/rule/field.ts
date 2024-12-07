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
  IS_EU_COUNTRY: 'Is EU country',
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

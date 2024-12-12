import type { Simplify } from 'type-fest';
import { z } from 'zod';
import {} from '../country';
import type { FieldConfig, RuleField } from './field';
import {
  LINK_RULE_ACCEPT_LANGUAGE_FIELD_CONFIG,
  LinkRuleAcceptLanguageConditionSchema,
} from './field/accept-language';
import {
  LINK_RULE_CONTINENT_FIELD_CONFIG,
  LinkRuleContinentConditionSchema,
} from './field/continent';
import {
  LINK_RULE_COOKIE_FIELD_CONFIG,
  LinkRuleCookieConditionSchema,
} from './field/cookie';
import {
  LINK_RULE_COUNTRY_FIELD_CONFIG,
  LinkRuleCountryConditionSchema,
} from './field/country';
import {
  LINK_RULE_DEVICE_TYPE_FIELD_CONFIG,
  LinkRuleDeviceTypeConditionSchema,
} from './field/device-type';
import {
  LINK_RULE_IP_FIELD_CONFIG,
  LinkRuleIpConditionSchema,
} from './field/ip';
import {
  LINK_RULE_IS_EU_COUNTRY_FIELD_CONFIG,
  LinkRuleIsEuCountryConditionSchema,
} from './field/is-eu-country';
import {
  LINK_RULE_LATITUDE_FIELD_CONFIG,
  LINK_RULE_LONGITUDE_FIELD_CONFIG,
  LinkRuleLatitudeConditionSchema,
  LinkRuleLongitudeConditionSchema,
} from './field/latitude-longitude';
import {
  LINK_RULE_POSTAL_CODE_FIELD_CONFIG,
  LinkRulePostalCodeConditionSchema,
} from './field/postal-code';
import {
  LINK_RULE_QUERY_FIELD_CONFIG,
  LinkRuleQueryConditionSchema,
} from './field/query';
import {
  LINK_RULE_REFERER_FIELD_CONFIG,
  LinkRuleRefererConditionSchema,
} from './field/referer';
import {
  LINK_RULE_REGION_CODE_FIELD_CONFIG,
  LinkRuleRegionCodeConditionSchema,
} from './field/region';
import {
  LINK_RULE_SOURCE_FIELD_CONFIG,
  LinkRuleSourceConditionSchema,
} from './field/source';
import {
  LINK_RULE_TIME_FIELD_CONFIG,
  LinkRuleTimeConditionSchema,
} from './field/time';
import {
  LINK_RULE_USER_AGENT_FIELD_CONFIG,
  LinkRuleUserAgentConditionSchema,
} from './field/user-agent';
import {
  ARRAY_OPERATORS,
  ONE_VALUE_OPERATORS,
  TWO_VALUE_OPERATORS,
} from './operator';
// https://developers.cloudflare.com/ruleset-engine/rules-language/operators/#comparison-operators
// https://openflagr.github.io/flagr/api_docs/#operation/createFlag

export * from './field';
export * from './operator';

export const FIELD_CONFIGS: Record<RuleField, FieldConfig> = {
  ACCEPT_LANGUAGE: LINK_RULE_ACCEPT_LANGUAGE_FIELD_CONFIG,
  CONTINENT: LINK_RULE_CONTINENT_FIELD_CONFIG,
  COOKIE: LINK_RULE_COOKIE_FIELD_CONFIG,
  COUNTRY: LINK_RULE_COUNTRY_FIELD_CONFIG,
  DEVICE_TYPE: LINK_RULE_DEVICE_TYPE_FIELD_CONFIG,
  IP: LINK_RULE_IP_FIELD_CONFIG,
  IS_EU_COUNTRY: LINK_RULE_IS_EU_COUNTRY_FIELD_CONFIG,
  LATITUDE: LINK_RULE_LATITUDE_FIELD_CONFIG,
  LONGITUDE: LINK_RULE_LONGITUDE_FIELD_CONFIG,
  POSTAL_CODE: LINK_RULE_POSTAL_CODE_FIELD_CONFIG,
  QUERY: LINK_RULE_QUERY_FIELD_CONFIG,
  REFERER: LINK_RULE_REFERER_FIELD_CONFIG,
  REGION_CODE: LINK_RULE_REGION_CODE_FIELD_CONFIG,
  SOURCE: LINK_RULE_SOURCE_FIELD_CONFIG,
  TIME: LINK_RULE_TIME_FIELD_CONFIG,
  USER_AGENT: LINK_RULE_USER_AGENT_FIELD_CONFIG,
};

export const LinkRuleConditionValueSchemaMap: Record<
  RuleField,
  z.ZodType<unknown>
> = {
  ACCEPT_LANGUAGE: LinkRuleAcceptLanguageConditionSchema,
  CONTINENT: LinkRuleContinentConditionSchema,
  COOKIE: LinkRuleCookieConditionSchema,
  COUNTRY: LinkRuleCountryConditionSchema,
  DEVICE_TYPE: LinkRuleDeviceTypeConditionSchema,
  IP: LinkRuleIpConditionSchema,
  IS_EU_COUNTRY: LinkRuleIsEuCountryConditionSchema,
  LATITUDE: LinkRuleLatitudeConditionSchema,
  LONGITUDE: LinkRuleLongitudeConditionSchema,
  POSTAL_CODE: LinkRulePostalCodeConditionSchema,
  QUERY: LinkRuleQueryConditionSchema,
  REFERER: LinkRuleRefererConditionSchema,
  REGION_CODE: LinkRuleRegionCodeConditionSchema,
  SOURCE: LinkRuleSourceConditionSchema,
  TIME: LinkRuleTimeConditionSchema,
  USER_AGENT: LinkRuleUserAgentConditionSchema,
};

export const LinkRuleConditionSchema = z
  .discriminatedUnion('field', [
    LinkRuleAcceptLanguageConditionSchema,
    LinkRuleContinentConditionSchema,
    LinkRuleCookieConditionSchema,
    LinkRuleCountryConditionSchema,
    LinkRuleDeviceTypeConditionSchema,
    LinkRuleIpConditionSchema,
    LinkRuleIsEuCountryConditionSchema,
    LinkRuleLatitudeConditionSchema,
    LinkRuleLongitudeConditionSchema,
    LinkRulePostalCodeConditionSchema,
    LinkRuleQueryConditionSchema,
    LinkRuleRefererConditionSchema,
    LinkRuleRegionCodeConditionSchema,
    LinkRuleSourceConditionSchema,
    LinkRuleTimeConditionSchema,
    LinkRuleUserAgentConditionSchema,
  ])
  .superRefine((data, ctx) => {
    if (
      ONE_VALUE_OPERATORS.includes(data.operator) &&
      Array.isArray(data.value)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must not be an array',
        path: ['value'],
      });
    }

    if (
      TWO_VALUE_OPERATORS.includes(data.operator) &&
      (!Array.isArray(data.value) || data.value.length !== 2)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must be an array with 2 elements',
        path: ['value'],
      });
    }

    if (ARRAY_OPERATORS.includes(data.operator) && !Array.isArray(data.value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must be an array',
        path: ['value'],
      });
    }
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

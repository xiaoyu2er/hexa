import type { Simplify } from 'type-fest';
import { z } from 'zod';
import { ContinentSelectOptions } from '../continent';
import { type CountryCode, CountrySelectOptions } from '../country';
import { DeviceTypeSelectOptions } from '../device-type';
import { IsEUCountrySelectOptions } from '../is-eu-country';
import { RegionSelectOptionsMap } from '../region';
import type { RuleValueTypeCode } from '../rule-value-type';
import { SourceSelectOptions } from '../source';
import { type RuleField, zRuleFieldEnum } from './field';
import {
  LINK_RULE_ACCEPT_LANGUAGE_OPERATORS,
  LinkRuleAcceptLanguageConditionSchema,
} from './field/accept-language';
import {
  LINK_RULE_CONTINENT_OPERATORS,
  LinkRuleContinentConditionSchema,
} from './field/continent';
import {
  LINK_RULE_COOKIE_OPERATORS,
  LinkRuleCookieConditionSchema,
} from './field/cookie';
import {
  LINK_RULE_COUNTRY_OPERATORS,
  LinkRuleCountryConditionSchema,
} from './field/country';
import {
  LINK_RULE_DEVICE_TYPE_OPERATORS,
  LinkRuleDeviceTypeConditionSchema,
} from './field/device-type';
import { LINK_RULE_IP_OPERATORS, LinkRuleIpConditionSchema } from './field/ip';
import {
  LINK_RULE_IS_EU_COUNTRY_OPERATORS,
  LinkRuleIsEuCountryConditionSchema,
} from './field/is-eu-country';
import {
  LINK_RULE_LATITUDE_OPERATORS,
  LINK_RULE_LONGITUDE_OPERATORS,
  LinkRuleLatitudeConditionSchema,
  LinkRuleLongitudeConditionSchema,
} from './field/latitude-longitude';
import {
  LINK_RULE_POSTAL_CODE_OPERATORS,
  LinkRulePostalCodeConditionSchema,
} from './field/postal-code';
import {
  LINK_RULE_QUERY_OPERATORS,
  LinkRuleQueryConditionSchema,
} from './field/query';
import {
  LINK_RULE_REFERER_OPERATORS,
  LinkRuleRefererConditionSchema,
} from './field/referer';
import {
  LINK_RULE_REGION_CODE_OPERATORS,
  LinkRuleRegionCodeConditionSchema,
} from './field/region';
import {
  LINK_RULE_SOURCE_OPERATORS,
  LinkRuleSourceConditionSchema,
} from './field/source';
import {
  LINK_RULE_TIME_OPERATORS,
  LinkRuleTimeConditionSchema,
} from './field/time';
import {
  LINK_RULE_USER_AGENT_OPERATORS,
  LinkRuleUserAgentConditionSchema,
} from './field/user-agent';
import { type RuleOperator, zRuleOperatorEnum } from './operator';
// https://developers.cloudflare.com/ruleset-engine/rules-language/operators/#comparison-operators
// https://openflagr.github.io/flagr/api_docs/#operation/createFlag

export * from './field';
export * from './operator';

export const FIELD_CONFIGS: Record<
  RuleField,
  {
    operators: RuleOperator[];
    valueType: (
      operator: RuleOperator,
      conditions: LinkRuleCondition[]
    ) => { props?: Record<string, unknown>; type: RuleValueTypeCode };
  }
> = {
  COOKIE: {
    operators: LINK_RULE_COOKIE_OPERATORS,
    valueType: (operator) =>
      operator === 'REG' || operator === 'NREG'
        ? { type: 'REGEX' }
        : { type: 'INPUT' },
  },
  TIME: {
    operators: LINK_RULE_TIME_OPERATORS,
    valueType: () => ({ type: 'TIME' }),
  },
  REFERER: {
    operators: LINK_RULE_REFERER_OPERATORS,
    valueType: (operator) =>
      operator === 'REG' || operator === 'NREG'
        ? { type: 'REGEX' }
        : { type: 'INPUT' },
  },
  IP: {
    operators: LINK_RULE_IP_OPERATORS,
    valueType: () => ({ type: 'INPUT' }),
  },

  SOURCE: {
    operators: LINK_RULE_SOURCE_OPERATORS,
    valueType: () => ({
      type: 'SELECT',
      props: { options: SourceSelectOptions },
    }),
  },

  ACCEPT_LANGUAGE: {
    operators: LINK_RULE_ACCEPT_LANGUAGE_OPERATORS,
    valueType: () => ({ type: 'INPUT' }),
  },
  QUERY: {
    operators: LINK_RULE_QUERY_OPERATORS,
    valueType: () => ({ type: 'INPUT' }),
  },
  USER_AGENT: {
    operators: LINK_RULE_USER_AGENT_OPERATORS,
    valueType: () => ({ type: 'INPUT' }),
  },

  DEVICE_TYPE: {
    operators: LINK_RULE_DEVICE_TYPE_OPERATORS,
    valueType: (operator) =>
      operator === 'EQ' || operator === 'NEQ'
        ? { type: 'SELECT', props: { options: DeviceTypeSelectOptions } }
        : { type: 'MULTI_SELECT', props: { options: DeviceTypeSelectOptions } },
  },

  CONTINENT: {
    operators: LINK_RULE_CONTINENT_OPERATORS,
    valueType: (operator) =>
      operator === 'EQ' || operator === 'NEQ'
        ? { type: 'SELECT', props: { options: ContinentSelectOptions } }
        : { type: 'MULTI_SELECT', props: { options: ContinentSelectOptions } },
  },
  COUNTRY: {
    operators: LINK_RULE_COUNTRY_OPERATORS,
    valueType: (operator) =>
      operator === 'EQ' || operator === 'NEQ'
        ? { type: 'SELECT', props: { options: CountrySelectOptions } }
        : { type: 'MULTI_SELECT', props: { options: CountrySelectOptions } },
  },
  IS_EU_COUNTRY: {
    operators: LINK_RULE_IS_EU_COUNTRY_OPERATORS,
    valueType: () => ({
      type: 'SELECT',
      props: { options: IsEUCountrySelectOptions },
    }),
  },
  REGION_CODE: {
    operators: LINK_RULE_REGION_CODE_OPERATORS,
    valueType: (operator, conditions) => {
      const country = conditions?.find(
        (c) => c.field === 'COUNTRY' && c.operator === 'EQ'
      );
      if (
        country?.value &&
        (country.value as CountryCode) in RegionSelectOptionsMap
      ) {
        return operator === 'EQ' || operator === 'NEQ'
          ? {
              type: 'SELECT',
              props: {
                options:
                  RegionSelectOptionsMap[
                    country.value as keyof typeof RegionSelectOptionsMap
                  ],
              },
            }
          : {
              type: 'MULTI_SELECT',
              props: {
                options:
                  RegionSelectOptionsMap[
                    country.value as keyof typeof RegionSelectOptionsMap
                  ],
              },
            };
      }
      return { type: 'INPUT' };
    },
  },
  LATITUDE: {
    operators: LINK_RULE_LATITUDE_OPERATORS,
    valueType: () => ({
      type: 'FLOAT',
      props: { min: -90, max: 90, type: 'number' },
    }),
  },
  LONGITUDE: {
    operators: LINK_RULE_LONGITUDE_OPERATORS,
    valueType: () => ({
      type: 'FLOAT',
      props: { min: -180, max: 180, type: 'number' },
    }),
  },
  POSTAL_CODE: {
    operators: LINK_RULE_POSTAL_CODE_OPERATORS,
    valueType: () => ({ type: 'INPUT' }),
  },
};

export const LinkRuleConditionValueSchemaMap: Record<
  RuleField,
  z.ZodType<unknown>
> = {
  COOKIE: LinkRuleCookieConditionSchema,
  TIME: LinkRuleTimeConditionSchema,
  CONTINENT: LinkRuleContinentConditionSchema,
  ACCEPT_LANGUAGE: LinkRuleAcceptLanguageConditionSchema,
  COUNTRY: LinkRuleCountryConditionSchema,
  DEVICE_TYPE: LinkRuleDeviceTypeConditionSchema,
  IS_EU_COUNTRY: LinkRuleIsEuCountryConditionSchema,
  IP: LinkRuleIpConditionSchema,
  LATITUDE: LinkRuleLatitudeConditionSchema,
  LONGITUDE: LinkRuleLongitudeConditionSchema,
  POSTAL_CODE: LinkRulePostalCodeConditionSchema,
  QUERY: LinkRuleQueryConditionSchema,
  REFERER: LinkRuleRefererConditionSchema,
  REGION_CODE: LinkRuleRegionCodeConditionSchema,
  SOURCE: LinkRuleSourceConditionSchema,
  USER_AGENT: LinkRuleUserAgentConditionSchema,
};
export const LinkRuleConditionSchema2 = z
  .object({
    field: zRuleFieldEnum,
    operator: zRuleOperatorEnum,
    value: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
  })
  .superRefine((data, ctx) => {
    if (
      (data.operator === 'IN' || data.operator === 'NOT_IN') &&
      !Array.isArray(data.value)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must be an array',
        path: ['value'],
      });
    }

    if (
      data.operator !== 'IN' &&
      data.operator !== 'NOT_IN' &&
      Array.isArray(data.value)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must not be an array',
        path: ['value'],
      });
    }

    const schema = LinkRuleConditionValueSchemaMap[data.field];

    if (schema) {
      const result = schema.safeParse(data);
      if (result.error) {
        for (const issue of result.error.issues) {
          ctx.addIssue(issue);
        }
      }
    }
  });

export const LinkRuleConditionSchema = z
  .discriminatedUnion('field', [
    LinkRuleTimeConditionSchema,
    LinkRuleContinentConditionSchema,
    LinkRuleAcceptLanguageConditionSchema,
    LinkRuleCountryConditionSchema,
    LinkRuleDeviceTypeConditionSchema,
    LinkRuleIsEuCountryConditionSchema,
    LinkRuleIpConditionSchema,
    LinkRuleLatitudeConditionSchema,
    LinkRuleLongitudeConditionSchema,
    LinkRulePostalCodeConditionSchema,
    LinkRuleQueryConditionSchema,
    LinkRuleRefererConditionSchema,
    LinkRuleRegionCodeConditionSchema,
    LinkRuleSourceConditionSchema,
    LinkRuleUserAgentConditionSchema,
  ])
  .superRefine((data, ctx) => {
    if (
      (data.operator === 'IN' ||
        data.operator === 'NOT_IN' ||
        data.operator === 'REG' ||
        data.operator === 'NREG') &&
      !Array.isArray(data.value)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must be an array',
        path: ['value'],
      });
    }

    if (
      data.operator !== 'IN' &&
      data.operator !== 'NOT_IN' &&
      data.operator !== 'REG' &&
      data.operator !== 'NREG' &&
      Array.isArray(data.value)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Value must not be an array',
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

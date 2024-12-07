import z from 'zod';
import type { SelectOptions } from './select-option';

export const IS_EU_COUNTRY_CODES = ['true', 'false'] as const;
export const zIsEUCountry = z
  .enum(IS_EU_COUNTRY_CODES)
  .transform((value) => value === 'true');

export const IS_EU_COUNTRIS = {
  true: 'True',
  false: 'False',
} as const;

export const IsEUCountrySelectOptions = Object.entries(IS_EU_COUNTRIS).map(
  ([value, label]) => ({
    label,
    value: value as (typeof IS_EU_COUNTRY_CODES)[number],
  })
) satisfies SelectOptions<(typeof IS_EU_COUNTRY_CODES)[number]>;

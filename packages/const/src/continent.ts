import { z } from 'zod';

// biome-ignore lint/nursery/noExportedImports: <explanation>
import type { ContinentCode } from '@cloudflare/workers-types';
import type { SelectOptions } from './select-option';

export const CONTINENT_CODES = [
  'NA',
  'SA',
  'EU',
  'AF',
  'AS',
  'OC',
  'AN',
] as const;

export const CONTINENTS: { [key in ContinentCode]: string } = {
  NA: 'North America',
  SA: 'South America',
  EU: 'Europe',
  AF: 'Africa',
  AS: 'Asia',
  OC: 'Oceania',
  AN: 'Antarctica',
} as const;

export const zContinentCode = z.enum(CONTINENT_CODES, {
  message: 'Please select a continent',
});
export const zContinentCodeArray = z
  .array(zContinentCode)
  .refine((value) => value.length > 0, {
    message: 'Please select at least one continent',
  });
export type { ContinentCode };

export const ContinentSelectOptions = Object.entries(CONTINENTS).map(
  ([code, name]) => ({
    label: name,
    value: code as ContinentCode,
  })
) satisfies SelectOptions<ContinentCode>;

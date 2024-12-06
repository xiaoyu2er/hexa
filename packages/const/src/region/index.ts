import { RegionSelectOptions as CNRegionSelectOptions } from './cn';
import { RegionSelectOptions as USRegionSelectOptions } from './us';

export const RegionSelectOptionsMap = {
  US: USRegionSelectOptions,
  CN: CNRegionSelectOptions,
} as const;

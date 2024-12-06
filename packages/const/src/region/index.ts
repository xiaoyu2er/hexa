import { RegionSelectOptions as USRegionSelectOptions } from './cn';
import { RegionSelectOptions as CNRegionSelectOptions } from './us';

export const RegionSelectOptionsMap = {
  US: USRegionSelectOptions,
  CN: CNRegionSelectOptions,
} as const;

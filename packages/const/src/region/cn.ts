/**
 * https://en.wikipedia.org/wiki/ISO_3166-2:CN
 */

import { z } from 'zod';
import type { SelectOptions } from '../select-option';

export const REGION_CODES = [
  'AH',
  'BJ',
  'CQ',
  'FJ',
  'GS',
  'GD',
  'GX',
  'GZ',
  'HI',
  'HE',
  'HL',
  'HA',
  'HB',
  'HN',
  'JS',
  'JX',
  'JL',
  'LN',
  'NM',
  'NX',
  'QH',
  'SN',
  'SD',
  'SH',
  'SX',
  'SC',
  'TJ',
  'XJ',
  'XZ',
  'YN',
  'ZJ',
  'HK',
  'MO',
  'TW',
] as const;

export const REGIONS: { [key in RegionCode]: string } = {
  AH: 'Anhui (安徽省)',
  BJ: 'Beijing (北京市)',
  CQ: 'Chongqing (重庆市)',
  FJ: 'Fujian (福建省)',
  GS: 'Gansu (甘肃省)',
  GD: 'Guangdong (广东省)',
  GX: 'Guangxi (广西壮族自治区)',
  GZ: 'Guizhou (贵州省)',
  HI: 'Hainan (海南省)',
  HE: 'Hebei (河北省)',
  HL: 'Heilongjiang (黑龙江省)',
  HA: 'Henan (河南省)',
  HB: 'Hubei (湖北省)',
  HN: 'Hunan (湖南省)',
  JS: 'Jiangsu (江苏省)',
  JX: 'Jiangxi (江西省)',
  JL: 'Jilin (吉林省)',
  LN: 'Liaoning (辽宁省)',
  NM: 'Inner Mongolia (内蒙古自治区)',
  NX: 'Ningxia (宁夏回族自治区)',
  QH: 'Qinghai (青海省)',
  SN: 'Shaanxi (陕西省)',
  SD: 'Shandong (山东省)',
  SH: 'Shanghai (上海市)',
  SX: 'Shanxi (山西省)',
  SC: 'Sichuan (四川省)',
  TJ: 'Tianjin (天津市)',
  XJ: 'Xinjiang (新疆维吾尔自治区)',
  XZ: 'Tibet (西藏自治区)',
  YN: 'Yunnan (云南省)',
  ZJ: 'Zhejiang (浙江省)',
  HK: 'Hong Kong (香港特别行政区)',
  MO: 'Macao (澳门特别行政区)',
  TW: 'Taiwan (台湾省)',
} as const;

export const zRegionCode = z.enum(REGION_CODES);
export type RegionCode = z.infer<typeof zRegionCode>;

export const RegionSelectOptions = Object.entries(REGIONS).map(
  ([code, name]) => ({
    label: name,
    value: code as RegionCode,
  })
) satisfies SelectOptions<RegionCode>;

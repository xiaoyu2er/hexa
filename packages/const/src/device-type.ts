// https://docs.uaparser.dev/api/main/get-device.html

import z from 'zod';

export const DEVICE_TYPE_CODES = [
  'CONSOLE',
  'EMBEDDED',
  'MOBILE',
  'SMARTTV',
  'TABLET',
  'WEARABLE',
  'XR',
  'DESKTOP',
] as const;

export const zDeviceTypeCode = z.enum(DEVICE_TYPE_CODES);
export type DeviceTypeCode = z.infer<typeof zDeviceTypeCode>;

export const DEVICE_TYPES = {
  DESKTOP: 'Desktop',
  MOBILE: 'Mobile',
  CONSOLE: 'Console',
  EMBEDDED: 'Embedded',
  SMARTTV: 'SmartTV',
  TABLET: 'Tablet',
  WEARABLE: 'Wearable',
  XR: 'XR',
} as const;

export const DeviceTypeSelectOptions = Object.entries(DEVICE_TYPES).map(
  ([key, value]) => ({
    label: value,
    value: key as DeviceTypeCode,
  })
);

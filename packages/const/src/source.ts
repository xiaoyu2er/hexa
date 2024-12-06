import { z } from 'zod';
import type { SelectOptions } from './select-option';

export const SOURCE_CODES = ['LINK', 'QR_CODE'] as const;

export const zSourceCode = z.enum(SOURCE_CODES);
export type SourceCode = z.infer<typeof zSourceCode>;

export const SOURCES = {
  LINK: 'Link',
  QR_CODE: 'QrCode',
} as const;

export const SourceSelectOptions = Object.entries(SOURCES).map(
  ([code, label]) => ({
    label,
    value: code as SourceCode,
  })
) satisfies SelectOptions<SourceCode>;

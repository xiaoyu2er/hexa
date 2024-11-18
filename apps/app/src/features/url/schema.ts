import { shortUrlTable } from '@/features/url/table';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

// Short Url
export const InsertShortUrlSchema = createInsertSchema(shortUrlTable);
export type InsertShortUrlType = z.infer<typeof InsertShortUrlSchema>;
export const SelectShortUrlSchema = createSelectSchema(shortUrlTable, {});
export type SelectShortUrlType = z.infer<typeof SelectShortUrlSchema>;

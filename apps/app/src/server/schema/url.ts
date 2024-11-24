import { urlTable } from '@/server/table/url';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import { z } from 'zod';

// Short Url schemas
export const InsertShortUrlSchema = createInsertSchema(urlTable, {
  destUrl: z.string().url('Please enter a valid URL'),
  slug: z.string().min(1, 'Slug is required').max(100),
  title: z.string().optional(),
  desc: z.string().optional(),
});

export type InsertShortUrlType = Simplify<z.infer<typeof InsertShortUrlSchema>>;

export const SelectShortUrlSchema = createSelectSchema(urlTable, {
  destUrl: z.string().url(),
  slug: z.string(),
}).extend({
  project: z.object({
    id: z.number(),
    name: z.string(),
    org: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
});

export type SelectShortUrlType = z.infer<typeof SelectShortUrlSchema>;

import { emailTable } from '@/server/table/email';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

// Email
export const InsertEmailSchema = createInsertSchema(emailTable);
export type InsertEmailType = z.infer<typeof InsertEmailSchema>;
export const SelectEmailSchema = createSelectSchema(emailTable);
export type SelectEmailType = z.infer<typeof SelectEmailSchema>;

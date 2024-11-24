import { emailTable } from '@/server/table/email';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zEmailString } from './common';

// Email
export const InsertEmailSchema = createInsertSchema(emailTable);
export type InsertEmailType = z.infer<typeof InsertEmailSchema>;
export const SelectEmailSchema = createSelectSchema(emailTable);
export type SelectEmailType = z.infer<typeof SelectEmailSchema>;

export const DeleteEmailSchema = z.object({
  email: zEmailString,
});
export type DeleteEmailType = z.infer<typeof DeleteEmailSchema>;

import { sessionTable } from '@hexa/server/table/session';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

// Session
export const InsertSessionSchema = createInsertSchema(sessionTable);
export type InsertSessionType = z.infer<typeof InsertSessionSchema>;
export const SelectSessionSchema = createSelectSchema(sessionTable, {});
export type SelectSessionType = z.infer<typeof SelectSessionSchema>;

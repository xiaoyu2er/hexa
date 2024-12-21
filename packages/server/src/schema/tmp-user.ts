import { tmpUserTable } from '@hexa/server/table/tmp-user';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { Simplify } from 'type-fest';
import type { z } from 'zod';

export const InsertTmpUserSchema = createInsertSchema(tmpUserTable);
export type InsertTmpUser = z.infer<typeof InsertTmpUserSchema>;
export const SelectTmpUserSchema = createSelectSchema(tmpUserTable);
export type SelectTmpUserType = Simplify<z.infer<typeof SelectTmpUserSchema>>;

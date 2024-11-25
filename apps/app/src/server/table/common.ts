import { type SQL, sql } from 'drizzle-orm';
import { type AnySQLiteColumn, integer } from 'drizzle-orm/sqlite-core';

export const expiresAt = {
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
};
export const createdAt = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$default(() => sql`unixepoch()`),
};

// custom lower function
export function lower(column: AnySQLiteColumn): SQL {
  return sql`lower(${column})`;
}

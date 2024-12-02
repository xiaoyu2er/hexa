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

export const updatedAt = {
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
};

export const lastCheckedAt = {
  lastCheckedAt: integer('last_checked_at', { mode: 'timestamp' }),
};

// custom lower function
export function lower(column: AnySQLiteColumn): SQL {
  return sql`lower(${column})`;
}

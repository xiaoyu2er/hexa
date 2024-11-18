import { sql } from 'drizzle-orm';
import { integer } from 'drizzle-orm/sqlite-core';

export const expiresAt = {
  expiresAt: integer('expires_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};
const _createdAt = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
};

export default {};

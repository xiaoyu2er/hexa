import { generateId } from '@hexa/lib';
import type { OrgMemberRoleType } from '@hexa/server/schema/org-member';
import { createdAt } from '@hexa/server/table/common';
import { tagIdNotNull } from '@hexa/server/table/tag';
import { linkIdNotNull } from '@hexa/server/table/link';
import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const linkTagTable = sqliteTable(
  'link_tag',
  {
    id: text('id')
      .primaryKey()
      .$default(() => generateId('linkt')),
    ...linkIdNotNull,
    ...tagIdNotNull,
    ...createdAt,
  },
  (t) => ({
    linkTagIndex: uniqueIndex('link_tag_index').on(t.linkId, t.tagId),
    linkIdIndex: index('link_tag_link_id_index').on(t.linkId),
    tagIdIndex: index('link_tag_tag_id_index').on(t.tagId),
  })
);

export default {
  linkTagTable,
};

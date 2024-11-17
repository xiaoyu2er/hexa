// ================ Relations ================
import { emailTable } from '@/features/email/table';
import { oauthAccountTable } from '@/features/oauth-account/table';
import { orgMemberTable } from '@/features/org-member/table';
import { orgTable } from '@/features/org/table';
import { tokenTable } from '@/features/passcode/table';
import { tmpUserTable } from '@/features/tmp-user/table';
import { shortUrlTable } from '@/features/url/table';
import { userTable } from '@/features/user/table';
import { workspaceOwnerTable } from '@/features/workspace-owner/table';
import { workspaceTable } from '@/features/workspace/table';
import { relations } from 'drizzle-orm';

export const oauthAccountRelations = relations(
  oauthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [oauthAccountTable.userId],
      references: [userTable.id],
    }),
  })
);

// User relations
export const userRelations = relations(userTable, ({ many, one }) => ({
  emails: many(emailTable),
  tokens: many(tokenTable),
  oauthAccounts: many(oauthAccountTable),
  defaultWs: one(workspaceTable, {
    fields: [userTable.defaultWsId],
    references: [workspaceTable.id],
  }),
}));

// Temp user relations
export const tmpUserRelations = relations(tmpUserTable, ({ many }) => ({
  tokens: many(tokenTable),
}));

// Email relations
export const emailRelations = relations(emailTable, ({ one }) => ({
  user: one(userTable, {
    fields: [emailTable.userId],
    references: [userTable.id],
  }),
}));

// Token relations
export const tokenRelations = relations(tokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [tokenTable.userId],
    references: [userTable.id],
  }),
  tmpUser: one(tmpUserTable, {
    fields: [tokenTable.tmpUserId],
    references: [tmpUserTable.id],
  }),
}));

// Org relations
export const orgRelations = relations(orgTable, ({ many }) => ({
  members: many(orgMemberTable),
  workspaces: many(workspaceOwnerTable),
}));

// Organization member relations
export const orgMemberRelations = relations(orgMemberTable, ({ one }) => ({
  org: one(orgTable, {
    fields: [orgMemberTable.orgId],
    references: [orgTable.id],
  }),
  user: one(userTable, {
    fields: [orgMemberTable.userId],
    references: [userTable.id],
  }),
}));

// Repository relations
export const workspaceRelations = relations(
  workspaceTable,
  ({ one, many }) => ({
    owner: one(workspaceOwnerTable, {
      fields: [workspaceTable.id],
      references: [workspaceOwnerTable.wsId],
    }),
    shortUrls: many(shortUrlTable),
  })
);

// Workspace owner relations
export const workspaceOwnerRelations = relations(
  workspaceOwnerTable,
  ({ one }) => ({
    workspace: one(workspaceTable, {
      fields: [workspaceOwnerTable.wsId],
      references: [workspaceTable.id],
    }),
    user: one(userTable, {
      fields: [workspaceOwnerTable.userId],
      references: [userTable.id],
    }),
    org: one(orgTable, {
      fields: [workspaceOwnerTable.orgId],
      references: [orgTable.id],
    }),
  })
);

// Short url relations
export const shortUrlRelations = relations(shortUrlTable, ({ one }) => ({
  workspace: one(workspaceTable, {
    fields: [shortUrlTable.repositoryId],
    references: [workspaceTable.id],
  }),
  creator: one(userTable, {
    fields: [shortUrlTable.creatorId],
    references: [userTable.id],
  }),
}));

export default {
  oauthAccountRelations,
  userRelations,
  tmpUserRelations,
  emailRelations,
  tokenRelations,
  orgRelations,
  orgMemberRelations,
  workspaceRelations,
  workspaceOwnerRelations,
  shortUrlRelations,
};

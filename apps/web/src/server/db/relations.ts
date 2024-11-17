import { oauthAccountTable } from '@/features/auth/oauth/table';
import { emailTable } from '@/features/email/table';
import { orgMemberTable } from '@/features/org-member/table';
import { orgTable } from '@/features/org/table';
import { passcodeTable } from '@/features/passcode/table';
import { sessionTable } from '@/features/session/table';
import { tmpUserTable } from '@/features/tmp-user/table';
import { shortUrlTable } from '@/features/url/table';
import { userTable } from '@/features/user/table';
import { workspaceOwnerTable } from '@/features/workspace-owner/table';
import { workspaceTable } from '@/features/workspace/table';

export {
  sessionTable,
  oauthAccountTable,
  emailTable,
  orgMemberTable,
  orgTable,
  passcodeTable,
  tmpUserTable,
  shortUrlTable,
  userTable,
  workspaceOwnerTable,
  workspaceTable,
};
import { relations } from 'drizzle-orm';

// ================ Relations ================
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
  tokens: many(passcodeTable),
  oauthAccounts: many(oauthAccountTable),
  defaultWs: one(workspaceTable, {
    fields: [userTable.defaultWsId],
    references: [workspaceTable.id],
  }),
}));

// Temp user relations
export const tmpUserRelations = relations(tmpUserTable, ({ many }) => ({
  tokens: many(passcodeTable),
}));

// Email relations
export const emailRelations = relations(emailTable, ({ one }) => ({
  user: one(userTable, {
    fields: [emailTable.userId],
    references: [userTable.id],
  }),
}));

// Token relations
export const passcodeRelations = relations(passcodeTable, ({ one }) => ({
  user: one(userTable, {
    fields: [passcodeTable.userId],
    references: [userTable.id],
  }),
  tmpUser: one(tmpUserTable, {
    fields: [passcodeTable.tmpUserId],
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

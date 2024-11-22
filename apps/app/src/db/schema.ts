import { oauthAccountTable } from '@/features/auth/oauth/table';
import { emailTable } from '@/features/email/table';
import { inviteTable } from '@/features/invite/table';
import { orgMemberTable } from '@/features/org-member/table';
import { orgTable } from '@/features/org/table';
import { passcodeTable } from '@/features/passcode/table';
import { projectTable } from '@/features/project/table';
import { sessionTable } from '@/features/session/table';
import { tmpUserTable } from '@/features/tmp-user/table';
import { urlTable } from '@/features/url/table';
import { userTable } from '@/features/user/table';
import { relations } from 'drizzle-orm';

export {
  // auth
  sessionTable,
  oauthAccountTable,
  emailTable,
  passcodeTable,
  tmpUserTable,
  // core
  userTable,
  projectTable,
  orgTable,
  orgMemberTable,
  // url
  urlTable,
  // invite
  inviteTable,
};

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
  passcodes: many(passcodeTable),
  oauthAccounts: many(oauthAccountTable),
  defaultProject: one(projectTable, {
    fields: [userTable.defaultProjectId],
    references: [projectTable.id],
  }),
  orgMembers: many(orgMemberTable),
}));

// Temp user relations
export const tmpUserRelations = relations(tmpUserTable, ({ many, one }) => ({
  tokens: many(passcodeTable),
  oauthAccount: one(oauthAccountTable, {
    fields: [tmpUserTable.oauthAccountId],
    references: [oauthAccountTable.id],
  }),
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
  projects: many(projectTable),
  invites: many(inviteTable),
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

// Invite relations
export const inviteRelations = relations(inviteTable, ({ one }) => ({
  inviter: one(userTable, {
    fields: [inviteTable.inviterId],
    references: [userTable.id],
  }),
  org: one(orgTable, {
    fields: [inviteTable.orgId],
    references: [orgTable.id],
  }),
}));

// Project relations
export const projectRelations = relations(projectTable, ({ one, many }) => ({
  org: one(orgTable, {
    fields: [projectTable.orgId],
    references: [orgTable.id],
  }),
  shortUrls: many(urlTable),
}));

// Short url relations
export const shortUrlRelations = relations(urlTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [urlTable.projectId],
    references: [projectTable.id],
  }),
}));

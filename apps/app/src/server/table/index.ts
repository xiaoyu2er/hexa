/**
 * This file is used to export all the tables and relations
 */
import { emailTable } from '@/server/table/email';
import { oauthAccountTable } from '@/server/table/oauth';
import { orgTable } from '@/server/table/org';
import { orgInviteTable } from '@/server/table/org-invite';
import { orgMemberTable } from '@/server/table/org-member';
import { passcodeTable } from '@/server/table/passcode';
import { projectTable } from '@/server/table/project';
import { sessionTable } from '@/server/table/session';
import { tmpUserTable } from '@/server/table/tmp-user';
import { urlTable } from '@/server/table/url';
import { userTable } from '@/server/table/user';
export * from '@/server/table/relations';

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
  orgInviteTable,
};
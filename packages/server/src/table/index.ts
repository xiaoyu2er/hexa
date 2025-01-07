import { domainTable } from '@hexa/server/table/domain';
/**
 * This file is used to export all the tables and relations
 */
import { emailTable } from '@hexa/server/table/email';
import { linkTable } from '@hexa/server/table/link';
import { oauthAccountTable } from '@hexa/server/table/oauth';
import { orgTable } from '@hexa/server/table/org';
import { orgInviteTable } from '@hexa/server/table/org-invite';
import { orgMemberTable } from '@hexa/server/table/org-member';
import { passcodeTable } from '@hexa/server/table/passcode';
import { projectTable } from '@hexa/server/table/project';
import { sessionTable } from '@hexa/server/table/session';
import { tagTable } from '@hexa/server/table/tag';
import { tmpUserTable } from '@hexa/server/table/tmp-user';
import { userTable } from '@hexa/server/table/user';
import { linkTagTable } from '@hexa/server/table/link-tag';

export * from '@hexa/server/table/relations';

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
  domainTable,
  // url
  linkTable,
  linkTagTable,
  // tag
  tagTable,
  // invite
  orgInviteTable,
};

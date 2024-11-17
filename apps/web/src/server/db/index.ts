import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

import commonTable from '@/features/common/table';
import emailTable from '@/features/email/table';
import oauthAccountTable from '@/features/oauth-account/table';
import orgMemberTable from '@/features/org-member/table';
import orgTable from '@/features/org/table';
import passcodeTable from '@/features/passcode/table';
import sessionTable from '@/features/session/table';
import tmpUserTable from '@/features/tmp-user/table';
import urlTable from '@/features/url/table';
import userTable from '@/features/user/table';
import workspaceOwnerTable from '@/features/workspace-owner/table';
import workspaceTable from '@/features/workspace/table';
import relations from './relations';

export const schema = {
  ...commonTable,
  ...emailTable,
  ...oauthAccountTable,
  ...orgMemberTable,
  ...orgTable,
  ...passcodeTable,
  ...sessionTable,
  ...tmpUserTable,
  ...urlTable,
  ...userTable,
  ...workspaceOwnerTable,
  ...workspaceTable,
  ...relations,
};
export const getD1 = async () => {
  const { env } = await getCloudflareContext();
  return env.DB;
};
export const getDb = async () => {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB, {
    schema,
  });
};

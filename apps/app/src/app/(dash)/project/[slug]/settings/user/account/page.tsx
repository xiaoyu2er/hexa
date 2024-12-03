import { DeleteAccount } from '@/components/user/settings/delete-account';
import { EditOauthAccount } from '@/components/user/settings/edit-oauth-account';
import { EditPassword } from '@/components/user/settings/edit-password';
import { EditUserEmails } from '@/components/user/settings/edit-user-email';
import { UserId } from '@/components/user/settings/user-id';

export default function () {
  return (
    <>
      <EditPassword />
      <EditUserEmails />
      <EditOauthAccount />
      <UserId />
      <DeleteAccount />
    </>
  );
}

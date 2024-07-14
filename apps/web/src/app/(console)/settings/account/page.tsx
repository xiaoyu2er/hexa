import { DeleteAccount } from "@/components/user-settings/delete-account";
// import { UserId } from "@/components/user-settings/user-id";
import { EditOAuthAccount } from "@/components/user-settings/edit-oauth-account";
import { EditUserEmails } from "@/components/user-settings/edit-user-email";
import { EditUsername } from "@/components/user-settings/edit-username";

export const dynamic = "force-dynamic";

export default function () {
  return (
    <>
      <EditUsername />
      <EditUserEmails />
      <EditOAuthAccount />
      {/* We don't have to show UserId */}
      {/* <UserId /> */}
      <DeleteAccount />
    </>
  );
}

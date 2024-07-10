import { DeleteAccount } from "@/components/user-settings/delete-account";
import { EditName } from "@/components/user-settings/edit-name";
import UploadAvatar from "@/components/user-settings/upload-avatar";
import { UserId } from "@/components/user-settings/user-id";
import { EditUserEmails } from "@/components/user-settings/edit-user-email";

export const dynamic = "force-dynamic";

export default function () {
  return (
    <>
      <EditName />
      <EditUserEmails />
      <UploadAvatar />
      <UserId />
      <DeleteAccount />
    </>
  );
}

import { DeleteAccount } from "@/components/user-settings/delete-account";
import { EditUserName } from "@/components/user-settings/edit-user-name";
import UploadAvatar from "@/components/user-settings/upload-avatar";
import { UserId } from "@/components/user-settings/user-id";

export default async function () {
  return (
    <>
      <EditUserName />
      <UploadAvatar />
      <UserId />
      <DeleteAccount />
    </>
  );
}

import { DeleteAccount } from "@/components/settings/delete-account";
import { EditUserName } from "@/components/settings/edit-user-name";
import UploadAvatar from "@/components/settings/upload-avatar";
import { UserId } from "@/components/settings/user-id";

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

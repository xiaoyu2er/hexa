import { DeleteAccount } from "@/components/user-settings/delete-account";
import { EditName } from "@/components/user-settings/edit-name";
import UploadAvatar from "@/components/user-settings/upload-avatar";
import { UserId } from "@/components/user-settings/user-id";

export default async function () {
  return (
    <>
      <EditName />
      <UploadAvatar />
      <UserId />
      <DeleteAccount />
    </>
  );
}

import { EditUserName } from "@/components/settings/edit-user-name";
import UploadAvatar from "@/components/settings/upload-avatar";

export default async function () {
  return (
    <>
      <EditUserName />
      <UploadAvatar />
    </>
  );
}

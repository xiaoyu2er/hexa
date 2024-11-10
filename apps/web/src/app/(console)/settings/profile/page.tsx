import { EditUserDisplayName } from "@/components/user-settings/edit-display-name";
import UploadAvatar from "@/components/user-settings/upload-avatar";

export const dynamic = "force-dynamic";

export default function () {
  return (
    <>
      <EditUserDisplayName />
      <UploadAvatar />
    </>
  );
}

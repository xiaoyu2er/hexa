import { EditName } from "@/components/user-settings/edit-name";
import UploadAvatar from "@/components/user-settings/upload-avatar";

export const dynamic = "force-dynamic";

export default function () {
  return (
    <>
      <EditName />
      <UploadAvatar />
    </>
  );
}

import { EditUserName } from '@/components/user/settings/edit-user-name';
import UploadAvatar from '@/components/user/settings/upload-avatar';

export const dynamic = 'force-dynamic';

export default function () {
  return (
    <>
      <EditUserName />
      <UploadAvatar />
    </>
  );
}

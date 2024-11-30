'use client';

import UploadAvatar from '@/components/upload-avatar';
import { EditUserName } from '@/components/user/settings/edit-user-name';
import { useUser } from '@/hooks/use-user';
import { $updateUserAvatar } from '@/lib/api';
import { getAvatarFallbackUrl } from '@/lib/user';

export function ProfilePage() {
  const { user, invalidate } = useUser();
  return (
    <>
      <EditUserName />
      <UploadAvatar
        title="User avatar"
        description="This avatar is your logo."
        onUpdate={(form) =>
          $updateUserAvatar({ form }).then(() => invalidate())
        }
        avatarUrl={user?.avatarUrl ?? getAvatarFallbackUrl(user)}
      />
    </>
  );
}

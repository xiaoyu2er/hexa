'use client';

import UploadAvatar from '@/components/upload-avatar';
import { EditUserName } from '@/components/user/settings/edit-user-name';
import { useUser } from '@/hooks/use-user';
import { getAvatarFallbackUrl } from '@/lib/user';
import { $updateUserAvatar } from '@hexa/server/api';
import type { FC } from 'react';

export const ProfilePage: FC = () => {
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
};

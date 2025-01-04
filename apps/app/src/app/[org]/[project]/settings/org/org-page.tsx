'use client';
import { DeleteOrg } from '@/components/org/settings/delete-org';
import { EditOrgName } from '@/components/org/settings/edit-org-name';
import { EditOrgSlug } from '@/components/org/settings/edit-org-slug';
import { OrgId } from '@/components/org/settings/org-id';
import UploadAvatar from '@/components/upload-avatar';
import { useProject } from '@/hooks/use-project';
import { getOrgAvatarFallbackUrl } from '@/lib/org';
import { $updateOrgAvatar } from '@hexa/server/api';
import type { FC } from 'react';

export const OrgPage: FC = () => {
  const {
    project: { org },
  } = useProject();

  return (
    <>
      <EditOrgName />
      <EditOrgSlug />
      <UploadAvatar
        title="Organization Avatar"
        description="This avatar is organization's logo."
        avatarUrl={org.avatarUrl ?? getOrgAvatarFallbackUrl(org)}
        onUpdate={(form) =>
          $updateOrgAvatar({ form: { ...form, orgId: org.id } })
        }
      />
      <OrgId />
      <DeleteOrg />
    </>
  );
};

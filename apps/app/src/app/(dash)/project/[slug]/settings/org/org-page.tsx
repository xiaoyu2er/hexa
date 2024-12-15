'use client';
import { DeleteOrg } from '@/components/orgs/settings/delete-org';
import { EditOrgName } from '@/components/orgs/settings/edit-org-name';
import { OrgId } from '@/components/orgs/settings/org-id';
import UploadAvatar from '@/components/upload-avatar';
import { useProject } from '@/hooks/use-project';
import { $updateOrgAvatar } from '@/lib/api';
import { getOrgAvatarFallbackUrl } from '@/lib/org';

export default function OrgPage() {
  const {
    project: { org },
  } = useProject();

  return (
    <>
      <EditOrgName />
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
}

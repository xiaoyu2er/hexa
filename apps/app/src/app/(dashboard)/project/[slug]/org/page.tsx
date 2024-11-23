import { DeleteOrg } from '@/components/orgs/settings/delete-org';
import { EditOrgName } from '@/components/orgs/settings/edit-org-name';
import { OrgId } from '@/components/orgs/settings/org-id';

export default function OrgSettingsPage() {
  return (
    <>
      <EditOrgName />
      <OrgId />
      <DeleteOrg />
    </>
  );
}

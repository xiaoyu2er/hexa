'use client';

import { CreateInvitesModal } from '@/components/orgs/invite/invite-create-modal';
import { OrgInviteTable } from '@/components/orgs/invite/invite-table';
import { OrgMemberTable } from '@/components/orgs/member/member-table';
import type { TableRef } from '@/components/table/base-table';
import { useProject } from '@/hooks/use-project';
import { invalidateOrgInvites } from '@/lib/queries/orgs';
import { useModal } from '@ebay/nice-modal-react';
import type { QueryInviteType } from '@hexa/server/schema/org-invite';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { useRef } from 'react';

export function MembersPage() {
  const { project } = useProject();
  const modal = useModal(CreateInvitesModal);
  const inviteTableRef = useRef<TableRef<QueryInviteType>>(null);

  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Members</h2>
        <p className="text-muted-foreground">Manage your team members here.</p>
      </div>

      <div className="relative">
        <Tabs defaultSelectedKey="members">
          <Tab key="members" title="Members">
            <OrgMemberTable />
          </Tab>
          <Tab key="invites" title="Invites">
            <OrgInviteTable ref={inviteTableRef} />
          </Tab>
        </Tabs>
        <Button
          color="primary"
          size="sm"
          className="absolute top-0 right-0"
          onPress={() =>
            modal.show(project).then(() => {
              inviteTableRef.current?.table.setPageIndex(0);
              invalidateOrgInvites(project.org.id);
            })
          }
        >
          Invite
        </Button>
      </div>
    </>
  );
}

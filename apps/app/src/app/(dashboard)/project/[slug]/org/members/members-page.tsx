'use client';

import { CreateInvitesModal } from '@/components/orgs/invite/invite-create-modal';
import {
  OrgInviteTable,
  type OrgInviteTableRef,
} from '@/components/orgs/invite/invite-table';
import { OrgMemberTable } from '@/components/orgs/member/member-table';
import { useProject } from '@/hooks/use-project';
import { invalidateOrgInvites } from '@/lib/queries/orgs';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@hexa/ui/tabs';
import { useRef } from 'react';

export function MembersPage() {
  const { project } = useProject();
  const modal = useModal(CreateInvitesModal);
  const inviteTableRef = useRef<OrgInviteTableRef>(null);

  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Members</h2>
        <p className="text-muted-foreground">Manage your team members here.</p>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>
        <Button
          variant="default"
          className="float-right"
          onClick={() =>
            modal.show(project).then(() => {
              inviteTableRef.current?.table.setPageIndex(0);
              invalidateOrgInvites(project.org.id);
            })
          }
        >
          Invite
        </Button>
        <TabsContent value="members" className="mt-4">
          <OrgMemberTable />
        </TabsContent>
        <TabsContent value="invites" className="mt-4">
          <OrgInviteTable ref={inviteTableRef} />
        </TabsContent>
      </Tabs>
    </>
  );
}

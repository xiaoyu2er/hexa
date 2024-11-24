'use client';

import { CreateInvitesModal } from '@/components/orgs/invites/create-invites-modal';
import { OrgInvites } from '@/components/orgs/invites/org-invites';
import { OrgMembers } from '@/components/orgs/members/org-members';
import { useProject } from '@/hooks/use-project';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@hexa/ui/tabs';

export function MembersPage() {
  const {
    project: { org },
  } = useProject();
  const modal = useModal(CreateInvitesModal);
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
          onClick={() => modal.show(org)}
        >
          Invite
        </Button>
        <TabsContent value="members" className="mt-4">
          <OrgMembers />
        </TabsContent>
        <TabsContent value="invites" className="mt-4">
          <OrgInvites />
        </TabsContent>
      </Tabs>
    </>
  );
}

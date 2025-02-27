import RevokeInvite from '@/components/org/invite/invite-revoke-button';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react';
import { Skeleton } from '@heroui/react';
import { cn } from '@hexa/lib';
import type { QueryInviteType } from '@hexa/server/schema/org-invite';
import { Badge } from '@hexa/ui/badge';
import type { Row } from '@tanstack/react-table';
import { capitalize } from 'lodash';

export const InviteCardActionModal = NiceModal.create(
  ({ row }: { row: Row<QueryInviteType> }) => {
    const modal = useModal();
    return (
      <Modal isOpen={modal.visible} onOpenChange={modal.remove} backdrop="blur">
        <ModalContent>
          <ModalHeader>Invite Actions</ModalHeader>
          <ModalBody>
            <RevokeInvite
              invite={row.original}
              className="w-full justify-start"
            />
            {/* Add more actions here as needed */}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);

export const InviteCard = ({ row }: { row: Row<QueryInviteType> }) => {
  const modal = useModal(InviteCardActionModal);
  return (
    <Card
      shadow="sm"
      isPressable
      onPress={() => modal.show({ row })}
      classNames={{
        base: 'w-full',
      }}
    >
      <CardBody>
        <div className="space-y-3">
          {/* Invitee Section */}
          <div>
            <div className="mb-1.5 font-medium text-muted-foreground text-xs">
              Invitee
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">{row.getValue('email')}</div>
              <div className="flex gap-2">
                <Badge variant="secondary">{row.getValue('role')}</Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    row.getValue('status') === 'PENDING'
                      ? 'border-yellow-500 text-yellow-500'
                      : 'border-red-500 text-red-500'
                  )}
                >
                  {capitalize(row.getValue('status'))}
                </Badge>
              </div>
            </div>
          </div>

          {/* Inviter Section */}
          <div>
            <div className="mb-1.5 font-medium text-muted-foreground text-xs">
              Invited by
            </div>
            <div className="flex items-center gap-2">
              <UserAvatar user={row.original.inviter} className="h-5 w-5" />
              <span className="text-sm">{row.original.inviter.name}</span>
            </div>
          </div>

          {/* Dates Section */}
          <div className="flex justify-between border-t pt-3 text-muted-foreground text-sm">
            <div className="space-y-1">
              <div className="font-medium text-xs">Invited</div>
              <div>
                {new Date(row.getValue('createdAt')).toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="font-medium text-xs">Expires</div>
              <div>
                {new Date(row.getValue('expiresAt')).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

InviteCard.displayName = 'InviteCard';

export const InviteCardSkeleton = () => (
  <Card>
    <CardBody>
      <div className="space-y-3">
        {/* Invitee Section */}
        <div>
          <div className="mb-1.5 font-medium text-muted-foreground text-xs">
            Invitee
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-[200px]" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-[70px]" />
              <Skeleton className="h-5 w-[70px]" />
            </div>
          </div>
        </div>

        {/* Inviter Section */}
        <div>
          <div className="mb-1.5 font-medium text-muted-foreground text-xs">
            Invited by
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
        </div>

        {/* Dates Section */}
        <div className="flex justify-between border-t pt-3 text-muted-foreground text-sm">
          <div className="space-y-1">
            <div className="font-medium text-xs">Invited</div>
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <div className="space-y-1 text-right">
            <div className="font-medium text-xs">Expires</div>
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

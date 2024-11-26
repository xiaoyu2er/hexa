import RevokeInvite from '@/components/orgs/invite/invite-revoke-button';
import { UserAvatar } from '@/components/user/settings/user-avatar';
import type { QueryInviteType } from '@/server/schema/org-invite';
import { Badge } from '@hexa/ui/badge';
import { Card, CardContent } from '@hexa/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@hexa/ui/sheet';
import { Skeleton } from '@hexa/ui/skeleton';
import { cn } from '@hexa/utils';
import type { Row } from '@tanstack/react-table';
import { capitalize } from 'lodash';
import { type HTMLAttributes, forwardRef } from 'react';

export const InviteCardWithActions = ({
  row,
}: { row: Row<QueryInviteType> }) => (
  <Sheet>
    <SheetTrigger asChild>
      <InviteCard row={row} />
    </SheetTrigger>

    <SheetContent side="bottom" className="h-fit max-h-[50vh]">
      <SheetHeader>
        <SheetTitle>Invite Actions</SheetTitle>
      </SheetHeader>
      <div className="mt-4 space-y-3">
        <RevokeInvite invite={row.original} className="w-full justify-start" />
        {/* Add more actions here as needed */}
      </div>
    </SheetContent>
  </Sheet>
);

export const InviteCard = forwardRef<
  HTMLDivElement,
  { row: Row<QueryInviteType> } & HTMLAttributes<HTMLDivElement>
>(({ row, className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn('mb-4 cursor-pointer hover:bg-muted/50', className)}
    {...props}
  >
    <CardContent className="p-4">
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
    </CardContent>
  </Card>
));

InviteCard.displayName = 'InviteCard';

export const InviteCardSkeleton = () => (
  <Card>
    <CardContent className="p-4">
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
    </CardContent>
  </Card>
);

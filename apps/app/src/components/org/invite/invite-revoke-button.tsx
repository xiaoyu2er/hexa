import { Button } from '@heroui/react';
import { cn } from '@hexa/lib';
import { $revokeInvite } from '@hexa/server/api';
import type { QueryInviteType } from '@hexa/server/schema/org-invite';
import { toast } from '@hexa/ui/sonner';
import { useMutation } from '@tanstack/react-query';
export default function RevokeInvite({
  invite,
  onSuccess,
  className,
}: {
  invite: QueryInviteType;
  onSuccess?: () => void;
  className?: string;
}) {
  const { mutateAsync: revokeInvite, isPending } = useMutation({
    mutationFn: () =>
      $revokeInvite({ json: { inviteId: invite.id, orgId: invite.orgId } }),
    onSuccess: () => {
      toast.success('Invite revoked');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to revoke invite');
    },
  });
  return (
    <div className={cn('flex items-center justify-end gap-2', className)}>
      <Button
        color="danger"
        size="sm"
        className="w-full"
        onPress={() => revokeInvite()}
        isLoading={isPending}
      >
        Revoke
      </Button>
    </div>
  );
}

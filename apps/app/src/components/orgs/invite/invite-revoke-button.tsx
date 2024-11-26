import { $revokeInvite } from '@/lib/api';
import type { QueryInviteType } from '@/server/schema/org-invite';
import { Button } from '@hexa/ui/button';
import { toast } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils/cn';
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
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={() => revokeInvite()}
        loading={isPending}
      >
        Revoke
      </Button>
    </div>
  );
}

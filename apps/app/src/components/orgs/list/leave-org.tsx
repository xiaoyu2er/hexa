'use client';

import { $leaveOrg } from '@/lib/api';
import { Button } from '@hexa/ui/button';
import { toast } from '@hexa/ui/sonner';
import { useMutation } from '@tanstack/react-query';

export const LeaveOrg = ({
  orgId,
  onSuccess,
}: {
  orgId: string;
  onSuccess?: () => void;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => $leaveOrg({ json: { orgId } }),
    onSuccess: () => {
      toast.success('You have left the organization');
      onSuccess?.();
    },
  });

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => mutateAsync()}
      loading={isPending}
    >
      Leave
    </Button>
  );
};

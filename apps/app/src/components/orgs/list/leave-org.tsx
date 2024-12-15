'use client';

import { $leaveOrg } from '@/lib/api';
import { toast } from '@hexa/ui/sonner';
import { Button } from '@nextui-org/react';
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
      variant="solid"
      color="danger"
      size="sm"
      onClick={() => mutateAsync()}
      isLoading={isPending}
    >
      Leave
    </Button>
  );
};

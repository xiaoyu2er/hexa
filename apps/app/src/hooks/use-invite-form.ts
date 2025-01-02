import { setFormError } from '@/components/form';
import { $createInvites } from '@hexa/server/api';
import {
  CreateInvitesSchema,
  type CreateInvitesType,
} from '@hexa/server/schema/org-invite';
import { OrgRoleOptions } from '@hexa/server/schema/org-member';
import type { OrgMemberRoleType } from '@hexa/server/schema/org-member';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

interface UseInviteFormOptions {
  orgId?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  showSuccessToast?: boolean;
}

export function getRoleOptions(currentRole?: OrgMemberRoleType) {
  switch (currentRole) {
    case 'OWNER':
      return OrgRoleOptions;
    case 'ADMIN':
      return OrgRoleOptions.filter((option) => option.value !== 'OWNER');
    default:
      return OrgRoleOptions.filter((option) => option.value === 'MEMBER');
  }
}

export function useInviteForm({
  orgId,
  onSuccess,
  onError,
  showSuccessToast = true,
}: UseInviteFormOptions = {}) {
  const form = useForm<CreateInvitesType>({
    resolver: zodResolver(CreateInvitesSchema),
    defaultValues: {
      orgId,
      invites: [{ email: '', role: 'MEMBER' }],
    },
  });

  const { handleSubmit, setError } = form;

  const { mutateAsync: createInvites } = useMutation({
    mutationFn: $createInvites,
    onSuccess: () => {
      if (showSuccessToast) {
        toast.success('Invites created successfully');
      }
      onSuccess?.();
    },
    onError: (err) => {
      setFormError(err, setError);
      onError?.(err);
    },
  });

  const onSubmit = handleSubmit((json) => createInvites({ json }));

  return {
    form,
    onSubmit,
  };
}

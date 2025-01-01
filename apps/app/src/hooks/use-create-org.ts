import { setFormError } from '@/components/form';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import { $createOrg } from '@hexa/server/api';
import {
  InsertOrgSchema,
  type InsertOrgType,
  type SelectOrgType,
} from '@hexa/server/schema/org';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

interface UseCreateOrgOptions {
  onSuccess?: (org: SelectOrgType) => void;
}

export function useCreateOrg({ onSuccess }: UseCreateOrgOptions = {}) {
  const form = useForm<InsertOrgType>({
    resolver: zodResolver(InsertOrgSchema),
  });

  const { handleSubmit, setError } = form;

  const { mutateAsync: createOrg } = useMutation({
    mutationFn: $createOrg,
    onError: (err) => {
      setFormError(err, setError);
      throw err;
    },
    onSuccess: ({ org }) => {
      toast.success('Organization created successfully');
      invalidateProjectsQuery();
      onSuccess?.(org);
    },
  });

  const onSubmit = handleSubmit((json) => createOrg({ json }));

  return {
    form,
    onSubmit,
  };
}

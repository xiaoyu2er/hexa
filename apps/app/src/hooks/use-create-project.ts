import { setFormError } from '@/components/form';
import { invalidateProjectsQuery } from '@/lib/queries/project';
import { $createProject } from '@hexa/server/api';
import type { SelectOrgType } from '@hexa/server/schema/org';
import {
  InsertProjectSchema,
  type InsertProjectType,
} from '@hexa/server/schema/project';
import { toast } from '@hexa/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface UseCreateProjectOptions {
  org: SelectOrgType;
  onSuccess?: (project: InsertProjectType) => void;
}

export function useCreateProject({ org, onSuccess }: UseCreateProjectOptions) {
  const form = useForm<InsertProjectType>({
    resolver: zodResolver(InsertProjectSchema),
  });

  useEffect(() => {
    form.setValue('orgId', org?.id);
  }, [org]);

  const { handleSubmit, setError } = form;

  const { mutateAsync: createProject } = useMutation({
    mutationFn: $createProject,
    onError: (err) => {
      setFormError(err, setError);
      throw err;
    },
    onSuccess: (data) => {
      toast.success('Project created successfully');
      invalidateProjectsQuery();
      onSuccess?.(data.project);
    },
  });

  const onSubmit = handleSubmit((json) => createProject({ json }));

  return {
    form,
    onSubmit,
  };
}

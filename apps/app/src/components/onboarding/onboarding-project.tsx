'use client';

import { CreateProjectForm } from '@/components/project/create-project-form';
import { useCreateProject } from '@/hooks/use-create-project';
import { WWW_URL } from '@hexa/env';
import type { SelectOrgType } from '@hexa/server/schema/org';
import { LogoIcon } from '@hexa/ui/icons';
import { Card, Link } from '@nextui-org/react';

interface OnboardingProjectProps {
  onNext: () => void;
  org: SelectOrgType;
}

export function OnboardingProject({ onNext, org }: OnboardingProjectProps) {
  const { form, onSubmit } = useCreateProject({
    org,
    onSuccess: () => {
      onNext();
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center">
            <LogoIcon className="w-12 h-12" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Create a project</h1>
            <p className="text-gray-600">
              <Link
                href={`${WWW_URL}/help/projects`}
                underline="always"
                size="sm"
                isExternal
                showAnchorIcon
              >
                What is a project?
              </Link>
            </p>
          </div>

          {org && (
            <CreateProjectForm
              form={form}
              onSubmit={onSubmit}
              className="w-full"
              org={org}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

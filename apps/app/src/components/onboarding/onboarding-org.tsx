'use client';

import { CreateOrgForm } from '@/components/org/create-org-form';
import { useCreateOrg } from '@/hooks/use-create-org';
import { WWW_URL } from '@hexa/env';
import type { SelectOrgType } from '@hexa/server/schema/org';
import { LogoIcon } from '@hexa/ui/icons';
import { Card, Link } from '@nextui-org/react';

interface OnboardingOrgProps {
  onNext: (org: SelectOrgType) => void;
}

export function OnboardingOrg({ onNext }: OnboardingOrgProps) {
  const { form, onSubmit } = useCreateOrg({
    onSuccess: (org) => {
      onNext(org);
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
            <h1 className="text-2xl font-bold mb-2">Create an organization</h1>
            <p className="text-gray-600">
              <Link
                href={`${WWW_URL}/help/organizations`}
                underline="always"
                size="sm"
                isExternal
                showAnchorIcon
              >
                What is an organization?
              </Link>
            </p>
          </div>

          <CreateOrgForm form={form} onSubmit={onSubmit} className="w-full" />
        </div>
      </Card>
    </div>
  );
}

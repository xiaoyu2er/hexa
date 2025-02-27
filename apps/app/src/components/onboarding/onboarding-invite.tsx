'use client';

import { InviteForm } from '@/components/org/invite/invite-form';
import { getRoleOptions, useInviteForm } from '@/hooks/use-invite-form';
import { Card } from '@heroui/react';
import type { SelectOrgType } from '@hexa/server/schema/org';
import { LogoIcon } from '@hexa/ui/icons';

interface OnboardingInviteProps {
  onNext: () => void;
  org: SelectOrgType;
}

export function OnboardingInvite({ onNext, org }: OnboardingInviteProps) {
  const { form, onSubmit } = useInviteForm({
    orgId: org.id,
    onSuccess: onNext,
    showSuccessToast: false,
  });

  return (
    <div className="grid place-items-center min-h-screen p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <LogoIcon className="w-12 h-12 mx-auto" />

          <div>
            <h1 className="text-2xl font-bold mb-2">Invite teammates</h1>
            <p className="text-gray-600">
              Invite teammates to join your workspace. Invitations will be valid
              for 14 days.
            </p>
          </div>
        </div>

        <InviteForm
          form={form}
          onSubmit={onSubmit}
          roleOptions={getRoleOptions('OWNER')}
          showSkip
          onSkip={onNext}
        />
      </Card>
    </div>
  );
}

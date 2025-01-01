'use client';

import type { SelectOrgType } from '@hexa/server/schema/org';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { useStep } from 'usehooks-ts';
import { OnboardingInvite } from './onboarding-invite';
import { OnboardingOrg } from './onboarding-org';
import { OnboardingProject } from './onboarding-project';
import { OnboardingWelcome } from './onboarding-welcome';

type Step = 'welcome' | 'org' | 'project' | 'invite';
type Steps = readonly Step[];

interface OnboardingFlowProps {
  steps: Steps;
  initialOrg?: SelectOrgType;
}

export function OnboardingFlow({ steps, initialOrg }: OnboardingFlowProps) {
  const [currentStep, { goToNextStep }] = useStep(steps.length);
  const [org, setOrg] = useState<SelectOrgType | undefined>(initialOrg);

  const handleOrgCreated = (newOrg: SelectOrgType) => {
    setOrg(newOrg);
    goToNextStep();
  };

  const renderStep = () => {
    const step = steps[currentStep - 1];

    switch (step) {
      case 'welcome':
        return <OnboardingWelcome onNext={goToNextStep} />;
      case 'org':
        return <OnboardingOrg onNext={handleOrgCreated} />;
      case 'project': {
        // We should have an org by this point, either from initial or created
        if (!org) {
          throw new Error('No organization available for project creation');
        }
        return <OnboardingProject onNext={goToNextStep} org={org} />;
      }
      case 'invite':
        return <OnboardingInvite onNext={() => redirect('/')} />;
      default:
        return null;
    }
  };

  return renderStep();
}

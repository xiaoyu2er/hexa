'use client';

import { NEXT_PUBLIC_APP_NAME } from '@hexa/env';
import { LogoIcon } from '@hexa/ui/icons';
import { Button, Card } from '@nextui-org/react';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center">
            <LogoIcon className="w-12 h-12" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Welcome to {NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="text-gray-600">
              {NEXT_PUBLIC_APP_NAME} gives you marketing superpowers with short
              links that stand out.
            </p>
          </div>

          <Button color="primary" onPress={onNext} className="w-full">
            Get started
          </Button>
        </div>
      </Card>
    </div>
  );
}

import { Icon } from '@iconify/react';
import { Button, Link } from '@nextui-org/react';
import { useState } from 'react';

export const OauthGithubButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      startContent={
        isLoading ? null : (
          <Icon className="text-default-500" icon="fe:github" width={24} />
        )
      }
      variant="bordered"
      as={Link}
      // If we use onPress, the button will be disabled when the link is clicked, however, the link will not be navigated to.
      onClick={() => setIsLoading(true)}
      href="/api/oauth/github"
      isLoading={isLoading}
    >
      Continue with Github
    </Button>
  );
};

export const OauthGoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      startContent={
        isLoading ? null : (
          <Icon
            className="text-default-500"
            icon="flat-color-icons:google"
            width={24}
          />
        )
      }
      // If we use onPress, the button will be disabled when the link is clicked, however, the link will not be navigated to.
      onClick={() => setIsLoading(true)}
      variant="bordered"
      as={Link}
      href="/api/oauth/google"
      isLoading={isLoading}
    >
      Continue with Google
    </Button>
  );
};

export function OauthButtons() {
  return (
    <div className="flex flex-col gap-2">
      <OauthGithubButton />
      <OauthGoogleButton />
    </div>
  );
}

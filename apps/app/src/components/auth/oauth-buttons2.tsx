import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import type { FC } from 'react';

export const OAuthButtons2: FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        startContent={
          <Icon
            className="text-default-500"
            icon="flat-color-icons:google"
            width={24}
          />
        }
        variant="bordered"
        as={Link}
        href="/api/oauth/google"
      >
        Continue with Google
      </Button>
      <Button
        startContent={
          <Icon className="text-default-500" icon="fe:github" width={24} />
        }
        variant="bordered"
        as={Link}
        href="/api/oauth/github"
      >
        Continue with Github
      </Button>
    </div>
  );
};

import { Button } from '@hexa/ui/button';
import { GithubIcon, GoogleIcon, Loader } from '@hexa/ui/icons';
import Link from 'next/link';
import { useState } from 'react';

const Loading = () => (
  <Loader className="mr-2 h-4 w-4 animate-spin" key="loading" />
);
export const OauthGithubButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      variant="outline"
      className="w-full"
      asChild
      disabled={isLoading}
      onClick={() => setIsLoading(true)}
    >
      <Link href="/api/oauth/github" prefetch={false}>
        {isLoading ? <Loading /> : <GithubIcon className="mr-2 h-5 w-5" />}
      </Link>
    </Button>
  );
};

export const OauthGoogleButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      variant="outline"
      className="w-full"
      asChild
      disabled={isLoading}
      onClick={() => setIsLoading(true)}
    >
      <Link href="/api/oauth/google" prefetch={false}>
        {isLoading ? <Loading /> : <GoogleIcon className="mr-2 h-5 w-5" />}
      </Link>
    </Button>
  );
};

export function OauthButtons() {
  return (
    <div className="flex space-x-2">
      <OauthGithubButton />
      <OauthGoogleButton />
    </div>
  );
}

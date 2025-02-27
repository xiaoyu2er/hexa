import { Link } from '@heroui/react';
import { WWW_URL } from '@hexa/env';
import type { FC } from 'react';

export const TermsPrivacy: FC = () => {
  return (
    <p className="px-8 text-center text-muted-foreground text-sm">
      By clicking continue, you agree to our{' '}
      <Link isExternal size="sm" href={`${WWW_URL}/legal/terms`}>
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link isExternal size="sm" href={`${WWW_URL}/legal/privacy`}>
        Privacy Policy
      </Link>
    </p>
  );
};

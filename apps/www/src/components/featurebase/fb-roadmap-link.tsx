'use client';

import arrowRightUpIcon from '@iconify/icons-solar/arrow-right-up-linear';
import { Icon } from '@iconify/react/dist/offline';
import { clsx } from '@nextui-org/shared-utils';
import NextLink from 'next/link';
import { usePostHog } from 'posthog-js/react';

type Props = {
  className?: string;
  innerClassName?: string;
};

export const FbRoadmapLink = ({ className, innerClassName }: Props) => {
  const posthog = usePostHog();

  const fbLinkOnClick = () => {
    posthog.capture('Featurebase - Roadmap', {
      name: 'featurebase-roadmap',
      action: 'press',
      category: 'featurebase',
    });
  };

  return (
    <NextLink
      className={clsx('inline-flex items-center', className)}
      color="foreground"
      href={`${process.env.NEXT_PUBLIC_FB_FEEDBACK_URL}/roadmap`}
      target="_blank"
      onClick={fbLinkOnClick}
    >
      <div className={clsx('relative', innerClassName)}>
        Roadmap
        <Icon
          className="absolute top-0 right-[-10px] outline-none transition-transform group-data-[hover=true]:translate-y-0.5 [&>path]:stroke-[2.5px]"
          icon={arrowRightUpIcon}
          width={10}
        />
      </div>
    </NextLink>
  );
};

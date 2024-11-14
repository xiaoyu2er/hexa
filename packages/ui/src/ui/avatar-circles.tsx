'use client';
// https://magicui.design/docs/components/avatar-circles

import { cn } from '@hexa/utils';

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  return (
    <div className={cn('-space-x-4 z-10 flex rtl:space-x-reverse', className)}>
      {avatarUrls.map((url, index) => (
        <img
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
          src={url}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      <a
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center font-medium text-white text-xs hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
        // biome-ignore lint/a11y/useValidAnchor: <explanation>
        href=""
      >
        +{numPeople}
      </a>
    </div>
  );
};

export { AvatarCircles };

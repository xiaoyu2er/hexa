'use client';

import type { SelectLinkType } from '@/server/schema/link';
import { LinkIcon } from '@hexa/ui/icons';
import { CopyButton } from './copy-button';

interface LinkInfoProps {
  link: SelectLinkType;
  size?: 'sm' | 'default';
  showClicks?: boolean;
  clicksPosition?: 'inline' | 'right';
  showDate?: boolean;
  variant?: 'default' | 'badge';
}

export function LinkInfo({
  link,
  size = 'default',
  showClicks = true,
  clicksPosition = 'inline',
  showDate = true,
  variant = 'default',
}: LinkInfoProps) {
  const shortUrl = `${link.domain}/${link.slug}`;
  const iconSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconInnerSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className="flex min-w-0 flex-1">
      <div className="flex w-full items-start gap-3">
        <div
          className={`flex flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${iconSize}`}
        >
          <LinkIcon className={`text-gray-600 ${iconInnerSize}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{shortUrl}</span>
            <CopyButton url={shortUrl} className="flex-shrink-0" />
          </div>
          <div className="mt-0.5 text-gray-500 text-sm">
            <span className="inline-block max-w-[220px] truncate md:max-w-[400px]">
              {link.destUrl || 'No URL configured'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

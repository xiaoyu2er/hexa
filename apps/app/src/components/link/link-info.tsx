'use client';

import type { SelectLinkType } from '@/server/schema/link';
import { LinkIcon, SparklesIcon } from '@hexa/ui/icons';
import { cn } from '@hexa/utils';
import { formatDate } from '@hexa/utils/date';
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
  const clicks = `${link.clicks || 0} clicks`;

  const ClicksDisplay = () => (
    <div
      className={cn(
        'flex items-center gap-1 text-muted-foreground text-sm',
        variant === 'badge' && 'rounded-md bg-muted px-2 py-0.5'
      )}
    >
      <SparklesIcon className="h-3.5 w-3.5" />
      {clicks}
    </div>
  );

  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center rounded-full bg-primary/10 ${iconSize}`}
        >
          <LinkIcon className={`text-primary ${iconInnerSize}`} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{shortUrl}</span>
            <CopyButton url={shortUrl} />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="line-clamp-1">
              ↳ {link.destUrl || 'No URL configured'}
            </span>
            {showDate && (
              <>
                <span className="text-gray-300">•</span>
                <span>{formatDate(link.createdAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {showClicks && clicksPosition === 'right' && <ClicksDisplay />}
    </div>
  );
}

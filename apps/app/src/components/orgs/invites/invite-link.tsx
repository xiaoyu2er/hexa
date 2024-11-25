'use client';

import { getInviteUrl } from '@/lib/emails/url';
import { Button } from '@hexa/ui/button';
import { CopyIcon } from '@hexa/ui/icons';
import { toast } from '@hexa/ui/sonner';
import { cn } from '@hexa/utils';

interface InviteLinkProps {
  token: string;
  className?: string;
}

export function InviteLink({ token, className }: InviteLinkProps) {
  const inviteUrl = getInviteUrl(token);

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Copied!', {
        description: 'Invite link copied to clipboard',
        duration: 2000,
      });
    } catch (_err) {
      toast.error('Failed to copy', {
        description: 'Please try again',
        duration: 2000,
      });
    }
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyInviteLink}
        className={cn(
          'h-8 w-8 p-0',
          'hover:bg-muted/50',
          'focus-visible:ring-1 focus-visible:ring-ring'
        )}
        title="Copy invite link"
      >
        <CopyIcon className="h-4 w-4" />
        <span className="sr-only">Copy invite link</span>
      </Button>
    </div>
  );
}

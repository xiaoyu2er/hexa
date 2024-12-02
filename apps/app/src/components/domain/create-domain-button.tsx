'use client';
import { useProject } from '@/hooks/use-project';
import { invalidateDomains } from '@/lib/queries/orgs';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';
import { CreateDomainModal } from './create-domain-modal';

export function CreateDomain({ className }: { className?: string }) {
  const modal = useModal(CreateDomainModal);
  const { project } = useProject();
  return (
    <Button
      onClick={() => {
        modal.show().then(() => {
          invalidateDomains(project.org.id);
        });
      }}
      className={className}
    >
      Create Domain
    </Button>
  );
}

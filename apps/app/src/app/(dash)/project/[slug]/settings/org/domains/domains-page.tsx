'use client';

import { DomainTable } from '@/components/domain/domain-table';

export function DomainsPage() {
  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Domains</h2>
        <p className="text-muted-foreground">Manage your domains here.</p>
      </div>

      <DomainTable />
    </>
  );
}

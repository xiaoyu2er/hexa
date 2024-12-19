'use client';

import { DomainTable } from '@/components/domain/domain-table';
import type { FC } from 'react';
export const DomainsPage: FC = () => {
  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Domains</h2>
        <p className="text-muted-foreground">Manage your domains here.</p>
      </div>

      <DomainTable />
    </>
  );
};

'use client';

import { LinkTable } from '@/components/link/link-table';

export default function () {
  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Links</h2>
        <p className="text-muted-foreground">Manage your Links here.</p>
      </div>
      <LinkTable />
    </>
  );
}

'use client';

import { UrlTable } from '@/components/url/url-table';

export default function () {
  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Links</h2>
        <p className="text-muted-foreground">Manage your Links here.</p>
      </div>
      <UrlTable />
    </>
  );
}

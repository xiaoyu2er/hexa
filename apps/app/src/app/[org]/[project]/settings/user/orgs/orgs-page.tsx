'use client';
import { toast } from '@hexa/ui/sonner';
import {} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { OrgTable } from '@/components/org/list/org-table';

export const OrgPage = () => {
  const searchParams = useSearchParams();
  const msg = searchParams.get('msg');

  useEffect(() => {
    if (msg) {
      toast.success(msg);
    }
  }, [msg]);

  return (
    <>
      <div>
        <h2 className="font-bold text-2xl tracking-tight">Organizations</h2>
        <p className="text-muted-foreground">Manage your organizations here.</p>
      </div>
      <OrgTable />
    </>
  );
};

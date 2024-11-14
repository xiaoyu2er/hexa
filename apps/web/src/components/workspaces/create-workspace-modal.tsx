'use client';

import { Dialog, DialogTrigger } from '@hexa/ui/responsive-dialog';
import type { ReactNode } from 'react';
import { useBoolean } from 'usehooks-ts';
import { CreateWorkspaceForm } from './create-workspace-form';

export function CreateWorkspaceModal({ children }: { children: ReactNode }) {
  const { value: isOpen, setFalse: close, setValue: setOpen } = useBoolean();
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <CreateWorkspaceForm onSuccess={close} />
    </Dialog>
  );
}

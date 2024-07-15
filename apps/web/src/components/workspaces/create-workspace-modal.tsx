"use client";

import { Dialog, DialogContent, DialogTrigger } from "@hexa/ui/dialog";
import type { ReactNode } from "react";
import { useBoolean } from "usehooks-ts";
import { CreateWorkspaceForm } from "./create-workspace-form";

export function CreateWorkspaceModal({ children }: { children: ReactNode }) {
  const { value: isOpen, setFalse: close, setValue: setOpen } = useBoolean();
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <CreateWorkspaceForm onSuccess={close} />
      </DialogContent>
    </Dialog>
  );
}

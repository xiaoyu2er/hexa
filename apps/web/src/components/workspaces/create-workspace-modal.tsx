"use client";

import { Dialog, DialogTrigger, DialogContent } from "@hexa/ui/dialog";
import { useBoolean } from "usehooks-ts";
import { ReactNode } from "react";
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

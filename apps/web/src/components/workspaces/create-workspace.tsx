"use client";

import { Button } from "@hexa/ui/button";
import { CreateWorkspaceModel } from "./create-workspace-modal";

export function CreateWorkspace() {
  return (
    <CreateWorkspaceModel>
      <Button>Create Workspace</Button>
    </CreateWorkspaceModel>
  );
}

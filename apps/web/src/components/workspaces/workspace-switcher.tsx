"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@hexa/ui/icons";

import { cn } from "@hexa/utils";
import { Button } from "@hexa/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@hexa/ui/popover";

import { CreateWorkspaceModal } from "./create-workspace-modal";
import { WorkspaceAvatar } from "./workspace-avatar";
import { WorkspaceModel } from "@/lib/db";
import { Badge } from "@hexa/ui/badge";
import { useServerAction } from "zsa-react";
import { setUserDefaultWorkspaceAction } from "@/lib/actions/workspace";
import { toast } from "@hexa/ui/sonner";
import { useRouter } from "next/navigation";
import { useBoolean } from "usehooks-ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryUserOptions } from "@/lib/queries/user";
import { queryWorkspacesOptions } from "@/lib/queries/workspace";

export function WorkspaceSwitcher() {
  const { data: user } = useSuspenseQuery(queryUserOptions);
  const { data: workspaces } = useSuspenseQuery(queryWorkspacesOptions);
  const { value: isPopoverOpen, setValue: setPopoverOpen } = useBoolean();
  const defaultWs = workspaces.find((ws) => ws.id === user.defaultWorkspaceId);
  const router = useRouter();
  const { execute } = useServerAction(setUserDefaultWorkspaceAction, {
    onSuccess({ data }) {
      const {
        workspace: { slug },
      } = data;
      toast.success("Workspace switched");
      setPopoverOpen(false);
      router.push(`/${slug}`);
    },
    onError({ err }) {
      toast.error("Failed to switch workspace" + err.message);
    },
  });
  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isPopoverOpen}
          aria-label="Select a team"
          className={cn("justify-between h-10 border-0 gap-3 max-w-80")}
        >
          {defaultWs ? (
            <>
              <WorkspaceAvatar
                workspace={defaultWs as WorkspaceModel}
                className="h-8 w-8"
              />
              <span className="text-left w-2/3 text-nowrap text-ellipsis overflow-hidden">
                {defaultWs.name}
              </span>

              <Badge className="!mt-0">Plan</Badge>
            </>
          ) : (
            "Select a workspace"
          )}
          <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="space-y-2 p-4">
          <p className="text-sm text-muted-foreground">
            Switch between your workspaces
          </p>
        </div>

        {workspaces.map((ws) => (
          <Button
            variant="ghost"
            className="w-full h-11 justify-start"
            onClick={() => {
              execute({ workspaceId: ws.id });
            }}
          >
            <WorkspaceAvatar workspace={ws} className="mr-2 h-6 w-6 " />
            <span className="text-left w-full shrink text-nowrap text-ellipsis overflow-hidden">
              {ws.name}
            </span>

            {ws.id === user.defaultWorkspaceId ? (
              <CheckIcon className={cn("ml-2 h-6 w-6")} />
            ) : null}
          </Button>
        ))}

        <CreateWorkspaceModal>
          <Button variant="ghost" className="w-full h-11">
            <PlusCircledIcon className="mr-2 h-6 w-6" />
            <span className="grow text-left">Create workspace</span>
          </Button>
        </CreateWorkspaceModal>
      </PopoverContent>
    </Popover>
  );
}

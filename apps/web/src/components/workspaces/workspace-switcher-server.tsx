"use server";

import * as React from "react";

import { getWorkspacesByUserId } from "@/lib/db/data-access/workspace";
import { validateRequest } from "@/lib/auth";
import { WorkspaceSwitcher } from "./workspace-switcher";

export async function WorkspaceSwitcherServer() {
  const { user } = await validateRequest();
  if (!user) return null;
  const list = await getWorkspacesByUserId(user.id);

  return (
    <WorkspaceSwitcher list={list} defaultWsId={user.defaultWorkspaceId} />
  );
}

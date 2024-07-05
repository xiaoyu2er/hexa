import { WorkspaceModel } from "./db";

export const getAvatarFallbackUrl = (ws: WorkspaceModel | null) => {
  return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${ws.name}`;
};

export const getAvatarFallbackName = (ws: WorkspaceModel | null) => {
  return (ws?.name ?? "WS").slice(0, 2).toUpperCase();
};

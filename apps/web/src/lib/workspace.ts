import type { WorkspaceModel } from '@/server/db';

export const getWorkspaceAvatarFallbackUrl = (ws: WorkspaceModel | null) => {
  return `https://api.dicebear.com/9.x/icons/svg?seed=${ws?.id}`;
};

export const getWorkspaceAvatarFallbackName = (ws: WorkspaceModel | null) => {
  return (ws?.name ?? 'WS').slice(0, 2).toUpperCase();
};

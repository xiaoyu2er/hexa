import type { SelectWorkspaceType } from '@/features/workspace/schema';

export const getWorkspaceAvatarFallbackUrl = (ws: SelectWorkspaceType) => {
  return `https://api.dicebear.com/9.x/icons/svg?seed=${ws?.id}`;
};

export const getWorkspaceSlug = (ws: SelectWorkspaceType) => {
  return `${ws.owner?.ownerName}/${ws.name}`;
};
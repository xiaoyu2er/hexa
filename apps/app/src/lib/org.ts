import { icons } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import type { SelectOrgType } from '@hexa/server/schema/org';

export const getOrgAvatarFallbackUrl = (org: SelectOrgType) => {
  const avatar = createAvatar(icons, {
    seed: org.id,
  });
  return avatar.toDataUri();
};

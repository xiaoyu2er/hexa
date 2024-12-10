import { Divider } from '@nextui-org/react';
import type { FC } from 'react';

export const DividerOr: FC = () => {
  return (
    <div className="flex items-center gap-4 py-2">
      <Divider className="flex-1" />
      <p className="shrink-0 text-default-500 text-tiny">OR</p>
      <Divider className="flex-1" />
    </div>
  );
};

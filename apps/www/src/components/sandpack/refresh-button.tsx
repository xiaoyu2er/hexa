import { useSandpackNavigation } from '@codesandbox/sandpack-react';
import { clsx } from '@heroui/shared-utils';

import { RotateRightLinearIcon } from '@/components/icons';
import type { ReactNode } from 'react';

interface RefreshButtonProps {
  clientId?: string;
}

/**
 * @category Components
 */
export const RefreshButton = ({ clientId }: RefreshButtonProps): ReactNode => {
  const { refresh } = useSandpackNavigation(clientId);

  return (
    <button
      className={clsx('sp-button', 'sp-icon-standalone')}
      title="Refresh Sandpack"
      type="button"
      onClick={refresh}
    >
      <RotateRightLinearIcon />
    </button>
  );
};

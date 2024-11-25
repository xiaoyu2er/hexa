import type { NiceModalHandler } from '@ebay/nice-modal-react';
import { Dialog as InnerDialog } from '@hexa/ui/responsive-dialog';
import type { ReactNode } from 'react';

export const Dialog = ({
  children,
  control,
}: {
  children: ReactNode;
  control: NiceModalHandler<Record<string, unknown>>;
}) => {
  return (
    <InnerDialog
      open={control.visible}
      onOpenChange={(v: boolean) => {
        if (!v) {
          control.resolveHide();
        }
        !v && !control.keepMounted && control.remove();
      }}
    >
      {children}
    </InnerDialog>
  );
};

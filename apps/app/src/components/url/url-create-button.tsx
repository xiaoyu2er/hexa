import { CreateUrlModal } from '@/components/url/url-create-modal';
import { useModal } from '@ebay/nice-modal-react';
import { Button } from '@hexa/ui/button';

export const UrlCreateButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const modal = useModal(CreateUrlModal);
  return (
    <Button
      onClick={() =>
        modal.show().then(() => {
          onSuccess();
        })
      }
    >
      Create Link
    </Button>
  );
};

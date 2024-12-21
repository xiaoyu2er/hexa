import { APP_URL } from '@hexa/env';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { ArrowLeft } from '@hexa/ui/icons';
import { useSidebar } from '@hexa/ui/sidebar';
import { Link } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

export const BackButton = () => {
  const { state } = useSidebar();
  const { isMobile } = useScreenSize();

  if (state === 'collapsed' && !isMobile) {
    return (
      <Button as={Link} href={APP_URL} isIconOnly variant="light" size="sm">
        <ArrowLeft className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      as={Link}
      href={APP_URL}
      variant="light"
      className="w-full justify-start"
      startContent={<ArrowLeft className="h-4 w-4" />}
    >
      APP
    </Button>
  );
};

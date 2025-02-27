import { Link } from '@heroui/react';
import { Button } from '@heroui/react';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { ArrowLeft } from '@hexa/ui/icons';
import { useSidebar } from '@hexa/ui/sidebar';

export const BackButton = ({ slug }: { slug: string }) => {
  const { state } = useSidebar();
  const { isMobile } = useScreenSize();
  if (state === 'collapsed' && !isMobile) {
    return (
      <Button
        as={Link}
        href={slug ? `/${slug}` : '/'}
        isIconOnly
        variant="light"
        size="sm"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      as={Link}
      href={slug ? `/${slug}` : '/'}
      variant="light"
      className="w-full justify-start"
      startContent={<ArrowLeft className="h-4 w-4" />}
    >
      Main Menu
    </Button>
  );
};

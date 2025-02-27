import { TipButton } from '@/components/tips/tip-button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { ExternalLinkIcon } from '@hexa/ui/icons';
import { useState } from 'react';

const CountryContent = () => (
  <div className="space-y-3">
    <div>
      <h4 className="font-medium text-sm">Country Code Detection</h4>
      <p className="text-default-500 text-xs">
        Uses
        <a
          href="https://www.iso.org/iso-3166-country-codes.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          ISO 3166-1 Alpha-2
          <ExternalLinkIcon className="h-3 w-3" />
        </a>
        country codes to identify request origins.
      </p>
    </div>
    <div className="space-y-2 text-default-500 text-xs">
      <p>
        Special code <span className="font-mono">T1</span> is used for TOR
        network requests.
      </p>
      <p>May be omitted if the origin cannot be determined.</p>
    </div>
  </div>
);

export const CountryTips = ({ className }: { className?: string }) => {
  const { isMobile } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <TipButton
          className={className}
          aria-label="About country codes"
          onPress={() => setIsModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          scrollBehavior="inside"
          size="full"
        >
          <ModalContent>
            <ModalHeader>Country Code Detection</ModalHeader>
            <ModalBody className="pb-6">
              <CountryContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="right" showArrow>
      <PopoverTrigger>
        <TipButton className={className} aria-label="About country codes" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="p-4">
          <CountryContent />
        </div>
      </PopoverContent>
    </Popover>
  );
};

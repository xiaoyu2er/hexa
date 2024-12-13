import { TipButton } from '@/components/tips/tip-button';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { ExternalLinkIcon } from '@hexa/ui/icons';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { useState } from 'react';

const examples = [
  {
    value: 'en-US,en;q=0.9',
    description: 'US English preferred, followed by any English variant',
  },
  {
    value: 'fr-CH,fr;q=0.9,en;q=0.8',
    description: 'Swiss French preferred, then French, then English',
  },
  {
    value: '*',
    description: 'Any language is acceptable',
  },
  {
    value: 'de',
    description: 'German language only',
  },
];

const AcceptLanguageContent = () => (
  <div className="space-y-3">
    <div>
      <h4 className="font-medium text-sm">Accept-Language Header</h4>
      <p className="text-default-500 text-xs">
        The Accept-Language header indicates the natural languages that the
        client prefers. It can include language tags with quality values (q) to
        indicate preference order.
      </p>
    </div>

    <div className="space-y-2">
      <h5 className="font-medium text-xs">Format Examples:</h5>
      <div className="space-y-2">
        {examples.map((example) => (
          <div key={example.value} className="space-y-1">
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {example.value}
            </code>
            <p className="text-default-500 text-xs">{example.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <h5 className="font-medium text-xs">Quality Values (q):</h5>
      <p className="text-default-500 text-xs">
        Values range from 0 to 1, where 1 is highest priority. If omitted, the
        default is 1.
      </p>
    </div>

    <div className="border-t pt-2">
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-muted-foreground text-xs hover:text-foreground"
      >
        Learn more about Accept-Language
        <ExternalLinkIcon className="ml-1 h-3 w-3" aria-label="External link" />
      </a>
    </div>
  </div>
);

export const AcceptLanguageTips = ({ className }: { className?: string }) => {
  const { isMobile } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <TipButton
          className={className}
          aria-label="About Accept-Language header"
          onClick={() => setIsModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          scrollBehavior="inside"
          size="full"
        >
          <ModalContent>
            <ModalHeader>Accept-Language Header</ModalHeader>
            <ModalBody className="pb-6">
              <AcceptLanguageContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="left-start">
      <PopoverTrigger>
        <TipButton
          className={className}
          aria-label="About Accept-Language header"
        />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="p-4">
          <AcceptLanguageContent />
        </div>
      </PopoverContent>
    </Popover>
  );
};

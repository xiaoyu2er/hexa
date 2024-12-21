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
    name: 'user_id',
    value: '12345',
    description: 'Simple key-value cookie',
  },
  {
    name: 'session',
    value: 'eyJhbGciOiJIUzI1NiJ9...',
    description: 'JWT token cookie',
  },
];

const CookieContent = () => (
  <div className="space-y-3">
    <div>
      <h4 className="font-medium text-sm">Cookie Detection</h4>
      <p className="text-default-500 text-xs">
        Reads cookies from requests to custom domains. This platform does not
        set cookies - it only reads existing cookies set by your domain.
      </p>
    </div>

    <div className="space-y-2">
      <h5 className="font-medium text-xs">Important Notes:</h5>
      <ul className="list-inside list-disc space-y-1 text-default-500 text-xs">
        <li>Only works with custom domain URLs</li>
        <li>Cookies must be set by your domain</li>
        <li>Cookie names are case-sensitive</li>
        {/* <li>Values are automatically URL decoded</li> */}
      </ul>
    </div>

    <div className="space-y-2">
      <h5 className="font-medium text-xs">Example Cookies:</h5>
      <div className="space-y-2">
        {examples.map((example) => (
          <div key={example.name} className="space-y-1">
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              {example.name}={example.value}
            </code>
            <p className="text-default-500 text-xs">{example.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t pt-2">
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-muted-foreground text-xs hover:text-foreground"
      >
        Learn more about HTTP Cookies
        <ExternalLinkIcon className="ml-1 h-3 w-3" aria-label="External link" />
      </a>
    </div>
  </div>
);

export const CookieTips = ({ className }: { className?: string }) => {
  const { isMobile } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <TipButton
          className={className}
          aria-label="About cookies"
          onPress={() => setIsModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          scrollBehavior="inside"
          size="full"
        >
          <ModalContent>
            <ModalHeader>Cookie Detection</ModalHeader>
            <ModalBody className="pb-6">
              <CookieContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="right" showArrow>
      <PopoverTrigger>
        <TipButton className={className} aria-label="About cookies" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="p-4">
          <CookieContent />
        </div>
      </PopoverContent>
    </Popover>
  );
};

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

const examples = [
  {
    browser: 'Chrome',
    value:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    description: 'Chrome on Linux',
  },
  {
    browser: 'Firefox',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
    description: 'Firefox on Windows',
  },
  {
    browser: 'Safari Mobile',
    value:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
    description: 'Safari on iPhone',
  },
];

const UserAgentContent = () => (
  <div className="space-y-3">
    <div>
      <h4 className="font-medium text-sm">User-Agent Header</h4>
      <p className="text-default-500 text-xs">
        The User-Agent header identifies the browser, operating system, and
        device making the request. It follows this general format:
      </p>
      <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-xs">
        Mozilla/5.0 (system-info) platform (details) extensions
      </code>
    </div>

    <div className="space-y-2">
      <h5 className="font-medium text-xs">Common Examples:</h5>
      <div className="space-y-2">
        {examples.map((example) => (
          <div key={example.browser} className="space-y-1">
            <div className="font-medium text-xs">{example.browser}</div>
            <code className="block break-all rounded bg-muted px-1.5 py-0.5 text-xs">
              {example.value}
            </code>
            <p className="text-default-500 text-xs">{example.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <h5 className="font-medium text-xs">Key Components:</h5>
      <ul className="list-inside list-disc space-y-1 text-default-500 text-xs">
        <li>Browser and version information</li>
        <li>Operating system and platform details</li>
        <li>Device type indicators (mobile, tablet)</li>
        <li>Rendering engine information</li>
      </ul>
    </div>

    <div className="border-t pt-2">
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-muted-foreground text-xs hover:text-foreground"
      >
        Learn more about User-Agent
        <ExternalLinkIcon className="ml-1 h-3 w-3" aria-label="External link" />
      </a>
    </div>
  </div>
);

export const UserAgentTips = ({ className }: { className?: string }) => {
  const { isMobile } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <TipButton
          className={className}
          aria-label="About User-Agent header"
          onPress={() => setIsModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          scrollBehavior="inside"
          size="full"
        >
          <ModalContent>
            <ModalHeader>User-Agent Header</ModalHeader>
            <ModalBody className="pb-6">
              <UserAgentContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="right" showArrow>
      <PopoverTrigger>
        <TipButton className={className} aria-label="About User-Agent header" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="p-4">
          <UserAgentContent />
        </div>
      </PopoverContent>
    </Popover>
  );
};

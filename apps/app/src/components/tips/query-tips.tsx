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
    value: '?name=John&age=25',
    description: 'Basic query parameters',
  },
  {
    value: '?product[color]=red&product[size]=large',
    description: 'Nested parameters',
  },
  {
    value: '?tags=javascript&tags=typescript',
    description: 'Multiple values for same parameter',
  },
  {
    value: '?q=search+term',
    description: 'Space encoded as +',
  },
  {
    value: '?redirect_url=https%3A%2F%2Fexample.com',
    description: 'URL encoded parameter',
  },
];

const QueryContent = () => (
  <div className="space-y-3">
    <div>
      <h4 className="font-medium text-sm">URL Query String</h4>
      <p className="text-default-500 text-xs">
        The query string is the part of a URL that follows a question mark (?),
        containing key-value pairs for passing parameters to the destination.
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
      <h5 className="font-medium text-xs">Key Points:</h5>
      <ul className="list-inside list-disc space-y-1 text-default-500 text-xs">
        <li>Parameters are separated by & symbol</li>
        <li>Each parameter is in key=value format</li>
        <li>Special characters must be URL encoded</li>
        <li>The same parameter name can appear multiple times</li>
      </ul>
    </div>

    <div className="border-t pt-2">
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/URL/search"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-muted-foreground text-xs hover:text-foreground"
      >
        Learn more about URL Query Strings
        <ExternalLinkIcon className="ml-1 h-3 w-3" aria-label="External link" />
      </a>
    </div>
  </div>
);

export const QueryTips = ({ className }: { className?: string }) => {
  const { isMobile } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <TipButton
          className={className}
          aria-label="About URL query strings"
          onClick={() => setIsModalOpen(true)}
        />
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          scrollBehavior="inside"
          size="full"
        >
          <ModalContent>
            <ModalHeader>URL Query String</ModalHeader>
            <ModalBody className="pb-6">
              <QueryContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover placement="right" showArrow>
      <PopoverTrigger>
        <TipButton className={className} aria-label="About URL query strings" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="p-4">
          <QueryContent />
        </div>
      </PopoverContent>
    </Popover>
  );
};

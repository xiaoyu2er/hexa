'use client';
import { type ReactNode, forwardRef, useRef } from 'react';

import { cn } from '@hexa/lib';
import { AnimatedBeam } from '@hexa/ui/animated-beam';
import {
  GoogleDocsIcon,
  GoogleDriveIcon,
  LogoIcon,
  NotionIcon,
  OpenAIIcon,
  User2Icon,
  WhatsAppIcon,
} from '@hexa/ui/icons';
import { Button } from '@nextui-org/react';

const Circle = forwardRef<
  HTMLButtonElement,
  { className?: string; children?: ReactNode }
>(({ className, children }, ref) => {
  return (
    <Button
      ref={ref}
      isIconOnly
      className={cn(
        'relative z-10 border-default-200 bg-white dark:bg-black',
        className
      )}
      radius="full"
      variant="bordered"
    >
      {children}
    </Button>
  );
});

Circle.displayName = 'Circle';

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const googleDriveRef = useRef<HTMLButtonElement>(null);
  const googleDocsRef = useRef<HTMLButtonElement>(null);
  const whatsAppRef = useRef<HTMLButtonElement>(null);
  const openAiRef = useRef<HTMLButtonElement>(null);
  const notionRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const personRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden rounded-lg p-10',
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={personRef}>
            <User2Icon className="h-5 w-5" strokeWidth={1.5} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={logoRef} className="size-16">
            <LogoIcon />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={googleDriveRef}>
            <GoogleDriveIcon />
          </Circle>
          <Circle ref={googleDocsRef}>
            <GoogleDocsIcon />
          </Circle>
          <Circle ref={whatsAppRef}>
            <WhatsAppIcon />
          </Circle>
          <Circle ref={openAiRef}>
            <OpenAIIcon />
          </Circle>
          <Circle ref={notionRef}>
            <NotionIcon />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={googleDriveRef}
        toRef={logoRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={googleDocsRef}
        toRef={logoRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={whatsAppRef}
        toRef={logoRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={openAiRef}
        toRef={logoRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={notionRef}
        toRef={logoRef}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={logoRef}
        toRef={personRef}
        duration={3}
      />
    </div>
  );
}

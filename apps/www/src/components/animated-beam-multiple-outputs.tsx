'use client';

import type React from 'react';
import { forwardRef, useRef } from 'react';

import { AnimatedBeam } from '@hexa/ui/animated-beam';
import {
  GoogleDocsIcon,
  GoogleDriveIcon,
  LogoIcon,
  NotionIcon,
  OpenAIIcon,
  UserIcon,
  WhatsAppIcon,
} from '@hexa/ui/icons';
import { cn } from '@hexa/utils';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const googleDriveRef = useRef<HTMLDivElement>(null);
  const googleDocsRef = useRef<HTMLDivElement>(null);
  const whatsAppRef = useRef<HTMLDivElement>(null);
  const openAiRef = useRef<HTMLDivElement>(null);
  const notionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-background p-10',
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={personRef}>
            <UserIcon />
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

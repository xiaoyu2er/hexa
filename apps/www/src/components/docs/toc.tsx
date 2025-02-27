'use client';

import { Divider, Spacer } from '@heroui/react';
import { ChevronCircleTopLinearIcon } from '@heroui/shared-icons';
import { clsx } from '@heroui/shared-utils';
import { type FC, useEffect, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import type { Heading } from '@/libs/docs/utils';
import emitter from '@/libs/emitter';

export interface DocsTocProps {
  headings: Heading[];
}

const paddingLeftByLevel: Record<number, string> = {
  1: 'pl-0',
  2: 'pl-0',
  3: 'pl-3',
  4: 'pl-6',
};

export const DocsToc: FC<DocsTocProps> = ({ headings }) => {
  const [isProBannerVisible, setIsProBannerVisible] = useState(true);

  const tocRef = useRef<HTMLDivElement>(null);

  const scrollPosition = useScrollPosition(tocRef);

  const activeId = useScrollSpy(
    headings.map(({ id }) => `[id="${id}"]`),
    {
      rootMargin: '0% 0% -80% 0%',
    }
  );

  const activeIndex = headings.findIndex(({ id }) => id === activeId);
  const firstId = headings[0]?.id;

  useEffect(() => {
    if (!activeId || activeIndex < 2) {
      return;
    }
    const anchor = tocRef.current?.querySelector(`li > a[href="#${activeId}"]`);

    if (anchor) {
      scrollIntoView(anchor, {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always',
        boundary: tocRef.current,
      });
    }
  }, [activeId, activeIndex]);

  useEffect(() => {
    emitter.on('proBannerVisibilityChange', (value) => {
      setIsProBannerVisible(value === 'visible');
    });

    return () => {
      emitter.off('proBannerVisibilityChange');
    };
  }, []);

  return (
    <div className={clsx('fixed', isProBannerVisible ? 'top-32' : 'top-20')}>
      <div
        ref={tocRef}
        className="scrollbar-hide flex max-h-[calc(100vh-500px)] w-full max-w-[12rem] flex-col gap-4 overflow-y-scroll pb-16 text-left"
        style={{
          WebkitMaskImage: `linear-gradient(to top, transparent 0%, #000 100px, #000 ${
            scrollPosition > 30 ? '90%' : '100%'
          }, transparent 100%)`,
        }}
      >
        <p className="font-medium text-sm">On this page</p>
        <ul className="scrollbar-hide flex flex-col gap-2">
          {headings.map(
            (heading, i) =>
              heading.level > 1 && (
                <li
                  key={i}
                  className={clsx(
                    'transition-colors',
                    'font-normal',
                    'flex items-center font-normal text-default-500 text-tiny dark:text-default-300',
                    'data-[active=true]:text-foreground',
                    'dark:data-[active=true]:text-foreground',
                    "before:content-['']",
                    'before:opacity-0',
                    'data-[active=true]:before:opacity-100',
                    'before:transition-opacity',
                    'before:-ml-3',
                    'before:absolute',
                    'before:bg-default-400',
                    'before:w-1',
                    'before:h-1',
                    'before:rounded-full',
                    paddingLeftByLevel[heading.level]
                  )}
                  data-active={activeId === heading.id}
                >
                  <a href={`#${heading.id}`}>{heading.text}</a>
                </li>
              )
          )}
          <li
            className="mt-2 opacity-0 transition-opacity data-[visible=true]:opacity-100"
            data-visible={activeIndex >= 2}
          >
            <Divider />
            <Spacer y={2} />
            <a
              className="flex items-center gap-2 pl-4 text-default-500 text-tiny transition-opacity hover:text-foreground/80 dark:text-foreground/30"
              href={`#${firstId}`}
            >
              Back to top
              <ChevronCircleTopLinearIcon />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

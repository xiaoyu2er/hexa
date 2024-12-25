import { Image } from '@nextui-org/react';
import type { ReactNode } from 'react';

interface DocsLayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <>
      <main className="container relative z-10 mx-auto mb-12 min-h-[calc(100vh_-_64px_-_108px)] max-w-7xl flex-grow px-6">
        {children}
      </main>
      <div
        aria-hidden="true"
        className="-bottom-[40%] -left-[20%] fixed z-0 hidden dark:opacity-70 dark:md:block"
      >
        <Image
          removeWrapper
          alt="docs left background"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/docs-left.png"
        />
      </div>
      <div
        aria-hidden="true"
        className="-top-[80%] -right-[60%] 2xl:-top-[60%] 2xl:-right-[45%] fixed z-0 hidden rotate-12 dark:opacity-70 dark:md:block"
      >
        <Image
          removeWrapper
          alt="docs right background"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/docs-right.png"
        />
      </div>
    </>
  );
}

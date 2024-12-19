'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

import { docsConfig } from '@/config/www/docs';
import { siteConfig } from '@/config/www/site';
import { LogoIcon } from '@hexa/ui/icons';
import { cn } from '@hexa/utils';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@nextui-org/react';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={() => setOpen(true)}
        className="mr-2 h-4 w-4 min-w-4 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
      >
        <svg
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
        >
          <title>Menu</title>
          <path
            d="M3 5H11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 19H21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <Drawer
        isOpen={open}
        onOpenChange={setOpen}
        placement="left"
        size="xs"
        backdrop="blur"
      >
        <DrawerContent className="pr-0">
          <DrawerHeader>
            <MobileLink
              href="/"
              className="flex items-center"
              onOpenChange={setOpen}
            >
              <LogoIcon className="mr-2 h-6 w-6" />
              <span className="font-bold">{siteConfig.name}</span>
            </MobileLink>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col space-y-3">
              {docsConfig.mainNav?.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                  )
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {docsConfig.sidebarNav.map((item, index) => (
                <div key={index} className="flex flex-col space-y-3 pt-6">
                  <h4 className="font-medium">{item.title}</h4>
                  {item.items?.map((item) =>
                    !item.disabled && item.href ? (
                      <MobileLink
                        key={item.href}
                        href={item.href}
                        onOpenChange={setOpen}
                        className={cn(
                          'text-muted-foreground',
                          item.disabled && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        {item.title}
                        {item.label && (
                          <span className="ml-2 rounded-md bg-[#FFBD7A] px-1.5 py-0.5 text-[#000000] text-xs leading-none no-underline group-hover:no-underline">
                            {item.label}
                          </span>
                        )}
                      </MobileLink>
                    ) : (
                      <span
                        key={index}
                        className={cn(
                          'text-muted-foreground',
                          item.disabled && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        {item.title}
                        {item.label && (
                          <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-xs leading-none no-underline group-hover:no-underline">
                            {item.label}
                          </span>
                        )}
                      </span>
                    )
                  )}
                </div>
              ))}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}

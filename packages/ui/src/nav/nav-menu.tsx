'use client';
import { APP_URL } from '@hexa/env';
import { cn } from '@hexa/lib';
import { LogoIcon } from '@hexa/ui/icons';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@hexa/ui/navigation-menu';

import Link from 'next/link';
import * as React from 'react';

const Resources: { title: string; href: string; description: string }[] = [
  {
    title: 'Blog',
    href: '/blog',
    description: 'In-depth articles about the product and the company.',
  },
  {
    title: 'Docs',
    href: '/docs/intro',
    description: 'Documentation for the product and the company.',
  },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href={APP_URL}
                  >
                    <LogoIcon className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">Links</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Short links to your favorite resources based on request's
                      location, time, and more.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href={APP_URL} title="Analytics">
                Track your links and see how they perform.
              </ListItem>
              <ListItem href={APP_URL} title="Custom Domains">
                Use your own domain to shorten your links.
              </ListItem>
              <ListItem href={APP_URL} title="Collaboration">
                Share your links with your team.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {Resources.map((resource) => (
                <ListItem
                  key={resource.title}
                  title={resource.title}
                  href={resource.href}
                >
                  {resource.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

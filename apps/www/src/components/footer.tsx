'use client';

import { Link } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

import { DiscordIcon, GithubIcon, XIcon } from '@/components/icons';
import { siteConfig } from '@/config/site';
import { getCurrentYear } from '@/utils/time';
import { APP_URL } from '@hexa/env';
import { Badge } from '@hexa/ui/badge';
import { LogoIcon } from '@hexa/ui/icons';

const products = [
  { name: 'Links', href: APP_URL },
  { name: 'Analytics', href: APP_URL },
  { name: 'Custom Domains', href: APP_URL },
  { name: 'API', href: APP_URL },
];

const resources = [
  { name: 'Blog', href: '/blog' },
  { name: 'Documentation', href: '/docs/what-is-hexa' },
  { name: 'Pricing', href: '/pricing' },
];

const compares = [{ name: 'Hexa vs Bitly', href: '/compare/hexa-vs-bitly' }];

const legal = [
  { name: 'Privacy', href: '/legal/privacy' },
  { name: 'Terms', href: '/legal/terms' },
  { name: 'Subprocessors', href: '/legal/subprocessors' },
  { name: 'DPA', href: '/legal/dpa' },
];

export const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes('/examples')) {
    return null;
  }

  return (
    <footer className="mx-auto flex w-full max-w-7xl flex-col justify-center border-t-1 border-white/5 px-4 pb-8 pt-16 md:px-12 lg:mt-12 lg:px-8">
      <div className="xl:grid xl:grid-cols-2 xl:gap-8">
        <div className="space-y-8 md:pr-8">
          <div className="flex items-center justify-start">
            <LogoIcon />
            <span className="ml-2 font-bold">Hexa</span>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </div>
          <p className="text-small text-default-400">
            © {getCurrentYear()} Hexa - Building the future of development
          </p>
          <div className="flex space-x-6">
            <Link
              isExternal
              href={siteConfig.links.twitter}
              aria-label="X"
              className="text-default-400"
            >
              <XIcon className="w-6" />
            </Link>
            <Link
              isExternal
              href={siteConfig.links.github}
              aria-label="Github"
              className="text-default-400"
            >
              <GithubIcon className="w-6" />
            </Link>
            <Link
              isExternal
              href={siteConfig.links.discord}
              aria-label="Discord"
              className="text-default-400"
            >
              <DiscordIcon className="w-6" />
            </Link>
          </div>
        </div>

        <div className="mt-16 sm:grid sm:grid-cols-3 sm:gap-8 lg:w-auto lg:text-right xl:mt-0">
          <div>
            <h3 className="text-small font-semibold text-default-600">
              Products
            </h3>
            <ul className="mt-2 space-y-1.5 sm:mt-3">
              {products.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-small text-default-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 md:mt-0">
            <h3 className="text-small font-semibold text-default-600">
              Resources
            </h3>
            <ul className="mt-2 space-y-1.5 sm:mt-3">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-small text-default-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 md:mt-0">
            <h3 className="text-small font-semibold text-default-600">
              Compare
            </h3>
            <ul className="mt-2 space-y-1.5 sm:mt-3">
              {compares.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-small text-default-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-small font-semibold text-default-600">
              Legal
            </h3>
            <ul className="mt-2 space-y-1.5 sm:mt-3">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-small text-default-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

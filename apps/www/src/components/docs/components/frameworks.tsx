import {
  // CloudflareIcon,
  // DrizzleIcon,
  NewNextJSIcon,
  // NextUIIcon,
  // TypeScriptIcon,
} from '@/components/icons';
import { FeaturesGrid } from '@/components/marketing/features-grid';

const frameworks = [
  {
    title: 'Next.js',
    description:
      'React framework with server components and app router for optimal performance.',
    icon: <NewNextJSIcon height={40} width={40} />,
    href: 'https://nextjs.org/docs',
    isExternal: true,
  },
  {
    title: 'TypeScript',
    description: 'Type-safe development with enhanced developer experience.',
    icon: <NewNextJSIcon height={40} width={40} />,
    href: 'https://www.typescriptlang.org/',
    isExternal: true,
  },
  {
    title: 'Cloudflare Workers',
    description: 'Edge computing platform for globally distributed execution.',
    icon: <NewNextJSIcon className="text-foreground" height={40} width={40} />,
    href: 'https://developers.cloudflare.com/workers/',
    isExternal: true,
  },
  {
    title: 'NextUI',
    description: 'Modern, beautiful and accessible UI components.',
    icon: <NewNextJSIcon className="text-foreground" height={40} width={40} />,
    href: 'https://nextui.org',
    isExternal: true,
  },
  {
    title: 'Drizzle',
    description: 'TypeScript ORM with first-class edge support.',
    icon: <NewNextJSIcon className="text-foreground" height={40} width={40} />,
    href: 'https://orm.drizzle.team',
    isExternal: true,
  },
];

export const Frameworks = () => {
  return (
    <FeaturesGrid
      classNames={{
        base: 'mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4',
        iconWrapper: 'bg-default-300/20',
        body: 'py-0',
      }}
      features={frameworks}
    />
  );
};

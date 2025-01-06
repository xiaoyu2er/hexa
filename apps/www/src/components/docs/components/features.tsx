import { FeaturesGrid } from '@/components/marketing/features-grid';

const frameworks = [
  {
    title: 'Edge-First Architecture',
    description:
      "Lightning-fast redirects powered by Cloudflare's global network",
    icon: '⚡',
  },
  {
    title: 'Team Collaboration',
    description: 'Organization-based billing with seamless team management',
    icon: '👥',
  },
  {
    title: 'Open Source',
    description: 'Transparent, extensible, and community-driven development',
    icon: '🌟',
  },
  {
    title: 'Enterprise Ready',
    description: 'Advanced analytics, custom domains, and API access',
    icon: '🏢',
  },
];

export const Features = () => {
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

import { AnimatedBeamMultipleOutputDemo } from '@/components/www/animated-beam-multiple-outputs';
import Hero from '@/components/www/hero';
import type { ReactElement } from 'react';

export default function Home(): ReactElement {
  return (
    <>
      <Hero />
      {/* <GlobeDemo /> */}
      <AnimatedBeamMultipleOutputDemo />
    </>
  );
}

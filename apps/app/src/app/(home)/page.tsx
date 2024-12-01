import { AnimatedBeamMultipleOutputDemo } from '@/components/www/animated-beam-multiple-outputs';
import Hero from '@/components/www/hero';
import type { ReactElement } from 'react';

export default function HomePage(): ReactElement {
  return (
    <>
      <Hero />
      {/* <GlobeDemo /> */}
      <AnimatedBeamMultipleOutputDemo />
    </>
  );
}

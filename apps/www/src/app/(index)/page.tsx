import { AnimatedBeamMultipleOutputDemo } from '@/components/animated-beam-multiple-outputs';
import Hero from '@/components/hero';
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

import Image from 'next/image';
import type { ReactNode } from 'react';

export default function NoDomain({ slot }: { slot?: ReactNode }) {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
      <h2 className="z-10 font-semibold text-gray-700 text-xl">
        You don't have any domains yet!
      </h2>
      {/* see more here https://popsy.co/illustrations */}
      <Image
        src="/illustrations/freelancer.svg"
        alt="No domains"
        width={400}
        height={400}
        className="pointer-events-none my-8 w-72"
      />
      {slot}
    </div>
  );
}

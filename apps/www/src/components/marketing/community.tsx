import { Spacer } from '@nextui-org/react';

import { sectionWrapper, subtitle, title, titleWrapper } from '../primitives';

import { FeaturesGrid } from '@/components/marketing/features-grid';
import { communityAccounts } from '@/libs/constants';

export const Community = () => {
  return (
    <section
      className={sectionWrapper({
        class: 'mt-16 flex flex-col items-center lg:mt-44',
      })}
    >
      <div className="flex max-w-4xl flex-col gap-8">
        <div>
          <div className={titleWrapper({ class: 'items-center' })}>
            <div className="inline-flex items-center">
              <h1 className={title({ size: 'lg' })}>Community</h1>&nbsp;&nbsp;
            </div>
          </div>
          <p
            className={subtitle({
              class: 'flex items-center justify-center text-center md:w-full',
            })}
          >
            Get involved in our community. Everyone is welcome!
          </p>
          <Spacer y={12} />
          <FeaturesGrid
            classNames={{
              base: 'lg:grid-cols-3',
              iconWrapper: 'bg-transparent',
              body: 'pt-0',
            }}
            features={communityAccounts}
          />
        </div>
      </div>
    </section>
  );
};

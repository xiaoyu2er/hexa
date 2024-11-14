import type { Meta, StoryObj } from '@storybook/react';

import { HeroVideoDialog } from '@hexa/ui/hero-video-dialog';

const meta: Meta<typeof HeroVideoDialog> = {
  component: HeroVideoDialog,
  args: {
    animationStyle: "from-center",
        videoSrc: "https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb",
        thumbnailSrc: "https://startup-template-sage.vercel.app/hero-light.png",
        thumbnailAlt: "Hero Video"
  },
   decorators: [
    (Story) => (
      <div className='sm:w-1/2 w-full'>
        <Story />
      </div>
    ),
   ]
  
};

export default meta;

type Story = StoryObj<typeof HeroVideoDialog>;

export const Primary: Story = {
};

import type { Meta, StoryObj } from '@storybook/react';

import { Iphone15Pro } from '@hexa/ui/iphone-15-pro';

const meta: Meta<typeof Iphone15Pro> = {
  component: Iphone15Pro,
};

export default meta;
type Story = StoryObj<typeof Iphone15Pro>;

export const Primary: Story = {
  args: {
      className: "size-full"
  },
  decorators: [
    (Story) => (
      <div className='md:w-1/3'>
        <Story />
       </div>
    ),
  ]
};
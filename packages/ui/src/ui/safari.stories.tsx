import type { Meta, StoryObj } from '@storybook/react';

import { Safari } from '@hexa/ui/safari';

const meta: Meta<typeof Safari> = {
  component: Safari,
};

export default meta;
type Story = StoryObj<typeof Safari>;

export const Primary: Story = {
  args: {
    url: 'hexa.im',
    width: 1203,
    height: 453,
    className: 'size-full',
  },
  decorators: [
    (Story) => (
      <div className="h-300px w-full sm:w-1/2">
        <Story />
      </div>
    ),
  ],
};

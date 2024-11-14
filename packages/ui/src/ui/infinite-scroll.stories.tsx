import type { Meta, StoryObj } from '@storybook/react';

import { InfiniteScrollDemo } from '@hexa/ui/infinite-scroll.demo';

const meta: Meta<typeof InfiniteScrollDemo> = {
  // component: InfiniteScrollDemo,
  render: () => <InfiniteScrollDemo />,
};

export default meta;

type Story = StoryObj<typeof InfiniteScrollDemo>;

export const Primary: Story = {};

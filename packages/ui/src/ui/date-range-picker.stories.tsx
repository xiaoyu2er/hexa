import type { Meta, StoryObj } from '@storybook/react';

import { DateRangePicker } from '@hexa/ui/date-range-picker';

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  args: {},
  decorators: [
    (Story) => (
      <div className="flex h-screen items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Primary: Story = {};

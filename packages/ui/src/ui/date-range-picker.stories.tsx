import type { Meta, StoryObj } from '@storybook/react';

import { DateRangePicker } from '@hexa/ui/date-range-picker';

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  args: {
    
  },
  decorators: [
    (Story) => (
      <div className='flex justify-center items-center h-screen'>
        <Story />
      </div>
    ),
  ]
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Primary: Story = {
};

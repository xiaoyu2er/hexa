import type { Meta, StoryObj } from '@storybook/react';

import { ConfettiButton } from '@hexa/ui/confetti';

const meta: Meta<typeof ConfettiButton> = {
  component: ConfettiButton,
  args: {
    children: 'Confetti 🎉'
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

type Story = StoryObj<typeof ConfettiButton>;

export const Primary: Story = {
};

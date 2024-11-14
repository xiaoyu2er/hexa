import type { Meta, StoryObj } from '@storybook/react';

import { AvatarCircles } from '@hexa/ui/avatar-circles';

const meta: Meta<typeof AvatarCircles> = {
  component: AvatarCircles,
};

export default meta;
type Story = StoryObj<typeof AvatarCircles>;

export const Primary: Story = {
  args: {
    avatarUrls: [
      'https://avatars.githubusercontent.com/u/16860528',
      'https://avatars.githubusercontent.com/u/20110627',
      'https://avatars.githubusercontent.com/u/106103625',
      'https://avatars.githubusercontent.com/u/59228569',
    ],
    numPeople: 99,
  },
};
